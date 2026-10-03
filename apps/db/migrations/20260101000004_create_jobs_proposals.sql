-- Migration 20260101000004_create_jobs_proposals.sql
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  poster_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  budget NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
  tenant_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  bid NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON jobs FROM anon, authenticated;
REVOKE ALL ON proposals FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON proposals TO authenticated;

CREATE POLICY "Freelancers and clients can view open jobs" ON jobs
FOR SELECT TO authenticated
USING (status = 'open' AND deleted_at IS NULL);

CREATE POLICY "Clients manage their posted jobs" ON jobs
FOR ALL TO authenticated
USING ((select auth.uid()) = poster_id)
WITH CHECK ((select auth.uid()) = poster_id);

CREATE POLICY "Freelancers view own proposals" ON proposals
FOR SELECT TO authenticated
USING ((select auth.uid()) = freelancer_id);

CREATE POLICY "Job posters view proposals for their jobs" ON proposals
FOR SELECT TO authenticated
USING (job_id IN (SELECT id FROM jobs WHERE poster_id = (select auth.uid())));
