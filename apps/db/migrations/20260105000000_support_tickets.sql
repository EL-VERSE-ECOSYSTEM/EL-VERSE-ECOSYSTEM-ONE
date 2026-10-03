-- Migration 20260105000000_support_tickets.sql
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('billing','technical','account','feature_request','other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting_customer','resolved','closed')),
  assigned_to UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer','agent','system')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

GRANT ALL ON support_tickets TO authenticated;
GRANT ALL ON ticket_messages TO authenticated;

CREATE POLICY "Users view own support tickets" ON support_tickets
FOR SELECT TO authenticated
USING ((select auth.uid()) = user_id OR EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = (select auth.uid())));

CREATE POLICY "Users insert support tickets" ON support_tickets
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users view messages for accessible tickets" ON ticket_messages
FOR SELECT TO authenticated
USING (ticket_id IN (SELECT id FROM support_tickets WHERE user_id = (select auth.uid()) OR EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = (select auth.uid()))));
