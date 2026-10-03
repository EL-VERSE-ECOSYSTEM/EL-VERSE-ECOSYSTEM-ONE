-- Migration 20260101000005_create_internships_transactions_messages.sql
CREATE TABLE IF NOT EXISTS internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  duration TEXT NOT NULL,
  stipend NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('korapay', 'paystack')),
  reference TEXT NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  tenant_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  definition JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  persona TEXT NOT NULL CHECK (persona IN ('menato', 'spectre', 'nelly', 'elly')),
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  score INT NOT NULL DEFAULT 0,
  tenant_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  stage TEXT NOT NULL DEFAULT 'new',
  owner_id UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL,
  raised_by UUID NOT NULL REFERENCES profiles(user_id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved')),
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all remaining tables
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON internships TO authenticated;
GRANT SELECT, INSERT ON transactions TO authenticated;
GRANT SELECT, INSERT ON messages TO authenticated;
GRANT ALL ON workflows TO authenticated;
GRANT SELECT ON workflow_runs TO authenticated;
GRANT ALL ON ai_conversations TO authenticated;
GRANT ALL ON crm_leads TO authenticated;
GRANT ALL ON crm_deals TO authenticated;
GRANT ALL ON disputes TO authenticated;
GRANT ALL ON notifications TO authenticated;

-- Row Level Security Policies
CREATE POLICY "Users view open internships" ON internships
FOR SELECT TO authenticated
USING (status = 'open' AND deleted_at IS NULL);

CREATE POLICY "Company manages own internships" ON internships
FOR ALL TO authenticated
USING ((select auth.uid()) = company_id)
WITH CHECK ((select auth.uid()) = company_id);

CREATE POLICY "Users view own transactions" ON transactions
FOR SELECT TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users view own messages" ON messages
FOR SELECT TO authenticated
USING ((select auth.uid()) = sender_id);

CREATE POLICY "Users insert own messages" ON messages
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = sender_id);

CREATE POLICY "Users view own notifications" ON notifications
FOR SELECT TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users manage own workflows" ON workflows
FOR ALL TO authenticated
USING ((select auth.uid()) = owner_id)
WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Users view workflow runs" ON workflow_runs
FOR SELECT TO authenticated
USING (workflow_id IN (SELECT id FROM workflows WHERE owner_id = (select auth.uid())));

CREATE POLICY "Users view own ai conversations" ON ai_conversations
FOR ALL TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Admins view all crm leads" ON crm_leads
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Admins view all crm deals" ON crm_deals
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Participants view disputes" ON disputes
FOR SELECT TO authenticated
USING ((select auth.uid()) = raised_by);
