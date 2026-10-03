-- Migration 20260103000000_crm.sql
CREATE TABLE IF NOT EXISTS crm_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  industry TEXT,
  owner_id UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES crm_companies(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT UNIQUE,
  owner_id UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

GRANT ALL ON crm_companies TO authenticated;
GRANT ALL ON crm_contacts TO authenticated;

CREATE POLICY "Admins manage crm_companies" ON crm_companies
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins manage crm_contacts" ON crm_contacts
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = (select auth.uid())));
