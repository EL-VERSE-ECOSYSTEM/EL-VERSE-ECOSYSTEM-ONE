-- Migration 20260101000000_create_profiles.sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('learner', 'tutor', 'freelancer', 'client', 'intern', 'company', 'admin')),
  tenant_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON profiles FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT TO authenticated
USING ((select auth.uid()) = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);
