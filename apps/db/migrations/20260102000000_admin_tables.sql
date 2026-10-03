-- Migration 20260102000000_admin_tables.sql
CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin','admin','moderator','finance','support','analyst')),
  mfa_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(user_id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  payload JSONB,
  status TEXT NOT NULL CHECK (status IN ('success','error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON admin_profiles TO authenticated;
GRANT SELECT ON admin_audit_log TO authenticated;

CREATE POLICY "Admin view own profile" ON admin_profiles
FOR SELECT TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins view audit log" ON admin_audit_log
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = (select auth.uid())));
