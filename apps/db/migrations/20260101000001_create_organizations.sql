-- Migration 20260101000001_create_organizations.sql
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON organizations FROM anon, authenticated;
REVOKE ALL ON org_members FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON org_members TO authenticated;

CREATE POLICY "Org members can view organization" ON organizations
FOR SELECT TO authenticated
USING (
  id IN (SELECT org_id FROM org_members WHERE user_id = (select auth.uid()))
  AND deleted_at IS NULL
);

CREATE POLICY "Org members can view member list" ON org_members
FOR SELECT TO authenticated
USING (
  org_id IN (SELECT org_id FROM org_members WHERE user_id = (select auth.uid()))
);
