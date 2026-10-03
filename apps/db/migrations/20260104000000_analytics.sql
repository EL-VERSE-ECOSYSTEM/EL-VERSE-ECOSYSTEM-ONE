-- Migration 20260104000000_analytics.sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_category TEXT,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON analytics_events TO authenticated;

CREATE POLICY "Users insert own analytics events" ON analytics_events
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Admins view all analytics events" ON analytics_events
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = (select auth.uid())));
