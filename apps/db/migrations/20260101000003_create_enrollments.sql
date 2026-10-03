-- Migration 20260101000003_create_enrollments.sql
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON enrollments FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON enrollments TO authenticated;

CREATE POLICY "Users can view own enrollments" ON enrollments
FOR SELECT TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can enroll themselves" ON enrollments
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = user_id);
