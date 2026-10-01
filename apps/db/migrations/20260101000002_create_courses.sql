-- Migration 20260101000002_create_courses.sql
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  tutor_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tenant_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON courses FROM anon, authenticated;
GRANT SELECT ON courses TO authenticated;
GRANT INSERT, UPDATE, DELETE ON courses TO authenticated;

CREATE POLICY "Learners can view published courses" ON courses
FOR SELECT TO authenticated
USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Tutors can manage their own courses" ON courses
FOR ALL TO authenticated
USING ((select auth.uid()) = tutor_id)
WITH CHECK ((select auth.uid()) = tutor_id);
