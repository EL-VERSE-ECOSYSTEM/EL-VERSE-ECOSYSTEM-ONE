-- =============================================================
-- Analytics Materialized Views with Unique Indexes
-- =============================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS daily_metrics AS
SELECT
  DATE(created_at) AS date,
  COUNT(DISTINCT user_id) AS active_users,
  COUNT(*) AS total_events,
  COUNT(DISTINCT session_id) AS total_sessions
FROM analytics_events
GROUP BY DATE(created_at)
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);

CREATE MATERIALIZED VIEW IF NOT EXISTS revenue_series AS
SELECT
  DATE(created_at) AS date,
  provider,
  COUNT(*) AS tx_count,
  COALESCE(SUM(amount), 0) AS revenue
FROM transactions
WHERE status = 'success'
GROUP BY DATE(created_at), provider
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_revenue_series_date_provider ON revenue_series(date, provider);

CREATE MATERIALIZED VIEW IF NOT EXISTS user_growth AS
SELECT
  DATE(created_at) AS date,
  role,
  COUNT(*) AS new_users,
  COUNT(*) FILTER (WHERE status = 'active') AS active_users
FROM profiles
GROUP BY DATE(created_at), role
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_growth_date_role ON user_growth(date, role);

CREATE MATERIALIZED VIEW IF NOT EXISTS platform_health AS
SELECT
  now() AS snapshot_at,
  (SELECT COUNT(*) FROM profiles WHERE last_active_at > now() - interval '1 hour') AS active_users_1h,
  (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') AS open_tickets,
  (SELECT COUNT(*) FROM moderation_queue WHERE status = 'pending') AS pending_moderation,
  (SELECT COALESCE(SUM(amount), 0) FROM transactions
   WHERE status = 'success' AND created_at > now() - interval '24 hours') AS revenue_24h,
  (SELECT COUNT(*) FROM jobs WHERE status = 'in_progress') AS active_projects
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_health_snapshot ON platform_health(snapshot_at);

-- =============================================================
-- Refresh Logging & Three-Tier Schedule Helper Functions
-- =============================================================

CREATE TABLE IF NOT EXISTS analytics_refresh_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  duration_ms INT,
  error_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_refresh_log_view ON analytics_refresh_log(view_name, created_at DESC);

CREATE OR REPLACE FUNCTION refresh_with_logging(view_name TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  start_ts TIMESTAMPTZ := clock_timestamp();
BEGIN
  EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I', view_name);
  INSERT INTO analytics_refresh_log (view_name, status, duration_ms)
  VALUES (view_name, 'success', EXTRACT(EPOCH FROM (clock_timestamp() - start_ts)) * 1000);
EXCEPTION WHEN OTHERS THEN
  INSERT INTO analytics_refresh_log (view_name, status, error_text, duration_ms)
  VALUES (view_name, 'error', SQLERRM, EXTRACT(EPOCH FROM (clock_timestamp() - start_ts)) * 1000);
END;
$$;

-- Tier 1: Platform Health Refresh (High-frequency)
CREATE OR REPLACE FUNCTION refresh_platform_health()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM refresh_with_logging('platform_health');
END;
$$;

-- Tier 2: Hourly Analytics Refresh
CREATE OR REPLACE FUNCTION refresh_hourly_analytics()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM refresh_with_logging('revenue_series');
END;
$$;

-- Tier 3: Nightly Analytics Refresh
CREATE OR REPLACE FUNCTION refresh_nightly_analytics()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM refresh_with_logging('daily_metrics');
  PERFORM refresh_with_logging('user_growth');
END;
$$;

-- Rate-Limited Revenue Refresh Trigger on Transactions
CREATE OR REPLACE FUNCTION trigger_revenue_refresh()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  last_refresh TIMESTAMPTZ;
BEGIN
  SELECT MAX(created_at) INTO last_refresh
  FROM analytics_refresh_log
  WHERE view_name = 'revenue_series' AND status = 'success';

  IF last_refresh IS NULL OR now() - last_refresh > interval '60 seconds' THEN
    PERFORM refresh_with_logging('revenue_series');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_revenue_refresh ON transactions;
CREATE TRIGGER trg_revenue_refresh
AFTER INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION trigger_revenue_refresh();

-- Realtime Analytics Broadcast Trigger
CREATE OR REPLACE FUNCTION broadcast_analytics_after_refresh()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  health jsonb;
BEGIN
  SELECT to_jsonb(p) INTO health FROM platform_health p LIMIT 1;
  PERFORM realtime.send(health, 'metrics_update', 'admin:analytics', true);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_broadcast_analytics ON analytics_refresh_log;
CREATE TRIGGER trg_broadcast_analytics
AFTER INSERT ON analytics_refresh_log
FOR EACH ROW
WHEN (NEW.view_name = 'platform_health' AND NEW.status = 'success')
EXECUTE FUNCTION broadcast_analytics_after_refresh();

-- =============================================================
-- Security: Revoke Access & Provide SECURITY DEFINER RPCs
-- =============================================================

REVOKE ALL ON platform_health FROM PUBLIC, anon, authenticated;
REVOKE ALL ON revenue_series FROM PUBLIC, anon, authenticated;
REVOKE ALL ON user_growth FROM PUBLIC, anon, authenticated;
REVOKE ALL ON daily_metrics FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION get_platform_health()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = (select auth.uid())
      AND role IN ('super_admin', 'admin', 'analyst')
  ) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  SELECT to_jsonb(p) INTO result FROM platform_health p LIMIT 1;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_platform_health() TO authenticated;
