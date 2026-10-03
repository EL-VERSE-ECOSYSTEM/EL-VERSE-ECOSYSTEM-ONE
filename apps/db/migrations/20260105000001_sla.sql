-- SLA policies per priority
CREATE TABLE IF NOT EXISTS sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  priority TEXT NOT NULL,
  response_minutes INT NOT NULL,
  resolution_minutes INT NOT NULL,
  business_hours_only BOOLEAN DEFAULT TRUE,
  escalation_levels JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default policies
INSERT INTO sla_policies (name, priority, response_minutes, resolution_minutes, escalation_levels) VALUES
  ('urgent',  'urgent',  60,    240,   '[{"pct":50,"role":"admin"},{"pct":75,"role":"admin"},{"pct":100,"role":"super_admin"}]'),
  ('high',    'high',    240,   1440,  '[{"pct":50,"role":"admin"},{"pct":100,"role":"admin"}]'),
  ('medium',  'medium',  480,   2880,  '[{"pct":100,"role":"admin"}]'),
  ('low',     'low',     1440,  7200,  '[]')
ON CONFLICT (name) DO NOTHING;

-- Business hours calendar
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  UNIQUE(day_of_week)
);

INSERT INTO business_hours (day_of_week, open_time, close_time) VALUES
  (1, '09:00', '18:00'), (2, '09:00', '18:00'),
  (3, '09:00', '18:00'), (4, '09:00', '18:00'),
  (5, '09:00', '17:00')
ON CONFLICT (day_of_week) DO NOTHING;

-- SLA tracking on tickets
ALTER TABLE support_tickets
  ADD COLUMN IF NOT EXISTS sla_response_due_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_resolution_due_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_response_met BOOLEAN,
  ADD COLUMN IF NOT EXISTS sla_resolution_met BOOLEAN,
  ADD COLUMN IF NOT EXISTS sla_paused BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sla_paused_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_pause_minutes INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS escalation_level INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_escalated_at TIMESTAMPTZ;

-- SLA audit log
CREATE TABLE IF NOT EXISTS sla_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sla_audit_ticket ON sla_audit_log(ticket_id, created_at DESC);

-- Business-hours-aware deadline calculation function
CREATE OR REPLACE FUNCTION calc_sla_deadline(
  start_at TIMESTAMPTZ,
  minutes INT,
  business_hours_only BOOLEAN
) RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
AS $$
DECLARE
  remaining INT := minutes;
  cursor_ts TIMESTAMPTZ := start_at;
  bh RECORD;
  day_open TIMESTAMPTZ;
  day_close TIMESTAMPTZ;
BEGIN
  IF NOT business_hours_only THEN
    RETURN start_at + (minutes || ' minutes')::interval;
  END IF;

  LOOP
    SELECT * INTO bh FROM business_hours
    WHERE day_of_week = EXTRACT(DOW FROM cursor_ts)::int;

    IF NOT FOUND THEN
      cursor_ts := date_trunc('day', cursor_ts) + interval '1 day';
      CONTINUE;
    END IF;

    day_open := date_trunc('day', cursor_ts) + bh.open_time;
    day_close := date_trunc('day', cursor_ts) + bh.close_time;

    IF cursor_ts < day_open THEN
      cursor_ts := day_open;
    END IF;

    IF cursor_ts >= day_close THEN
      cursor_ts := date_trunc('day', cursor_ts) + interval '1 day';
      CONTINUE;
    END IF;

    DECLARE
      available INT := EXTRACT(EPOCH FROM (day_close - cursor_ts)) / 60;
    BEGIN
      IF available >= remaining THEN
        RETURN cursor_ts + (remaining || ' minutes')::interval;
      ELSE
        remaining := remaining - available;
        cursor_ts := date_trunc('day', cursor_ts) + interval '1 day';
      END IF;
    END;
  END LOOP;
END;
$$;

-- Auto-calculate SLA deadlines on ticket creation
CREATE OR REPLACE FUNCTION set_ticket_sla()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  policy RECORD;
BEGIN
  SELECT * INTO policy FROM sla_policies WHERE priority = NEW.priority;
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  NEW.sla_response_due_at := calc_sla_deadline(now(), policy.response_minutes, policy.business_hours_only);
  NEW.sla_resolution_due_at := calc_sla_deadline(now(), policy.resolution_minutes, policy.business_hours_only);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_ticket_sla ON support_tickets;
CREATE TRIGGER trg_set_ticket_sla
BEFORE INSERT ON support_tickets
FOR EACH ROW EXECUTE FUNCTION set_ticket_sla();

-- Resume SLA helper
CREATE OR REPLACE FUNCTION resume_sla(ticket_id UUID, pause_minutes INT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE support_tickets
  SET sla_paused = FALSE,
      sla_paused_at = NULL,
      sla_pause_minutes = sla_pause_minutes + pause_minutes,
      sla_response_due_at = sla_response_due_at + (pause_minutes || ' minutes')::interval,
      sla_resolution_due_at = sla_resolution_due_at + (pause_minutes || ' minutes')::interval
  WHERE id = ticket_id;

  INSERT INTO sla_audit_log (ticket_id, event, details)
  VALUES (ticket_id, 'resumed', jsonb_build_object('pause_minutes', pause_minutes));
END;
$$;
