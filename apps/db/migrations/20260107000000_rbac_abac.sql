-- Migration 20260107000000_rbac_abac.sql
-- RBAC Tables
CREATE TABLE IF NOT EXISTS rbac_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    scope TEXT NOT NULL DEFAULT 'global',
    description TEXT,
    inherits UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rbac_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES rbac_roles(id) ON DELETE CASCADE,
    permission TEXT NOT NULL,
    UNIQUE(role_id, permission)
);

CREATE TABLE IF NOT EXISTS rbac_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES rbac_roles(id) ON DELETE CASCADE,
    arm_scope TEXT NOT NULL DEFAULT 'global', -- 'global' for global roles, or specific arm name
    granted_at TIMESTAMPTZ DEFAULT now(),
    granted_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, role_id, arm_scope)
);

-- ABAC Policies Table
CREATE TABLE IF NOT EXISTS abac_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    priority INT DEFAULT 100, -- Lower = higher priority
    effect TEXT NOT NULL CHECK (effect IN ('allow', 'deny')),
    subject_conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
    resource_conditions JSONB DEFAULT '{}'::jsonb,
    action_conditions JSONB DEFAULT '{}'::jsonb,
    environment_conditions JSONB DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE rbac_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rbac_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rbac_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE abac_policies ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON rbac_roles TO authenticated;
GRANT SELECT ON rbac_permissions TO authenticated;
GRANT SELECT ON rbac_user_roles TO authenticated;
GRANT SELECT ON abac_policies TO authenticated;

-- RBAC Permission Check Function
CREATE OR REPLACE FUNCTION has_permission(
    p_user_id UUID,
    p_permission TEXT
) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM rbac_user_roles ur
        JOIN rbac_roles r ON r.id = ur.role_id
        JOIN rbac_permissions rp ON rp.role_id = r.id
        WHERE ur.user_id = p_user_id
          AND (rp.permission = p_permission OR rp.permission = '*')
    );
$$;

-- ABAC Evaluation Function (Evaluates policies in priority order with default DENY)
CREATE OR REPLACE FUNCTION abac_check(
    p_user_id UUID,
    p_resource_type TEXT,
    p_resource_id UUID,
    p_action TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
    v_policy RECORD;
BEGIN
    -- Evaluate enabled policies in priority order (lower priority value = evaluated first)
    FOR v_policy IN
        SELECT * FROM abac_policies
        WHERE enabled = TRUE
        ORDER BY priority ASC
    LOOP
        -- Check if action condition matches (if specified)
        IF v_policy.action_conditions ? 'action' AND NOT (v_policy.action_conditions->'action' @> jsonb_build_array(p_action)) THEN
            CONTINUE;
        END IF;

        -- Check if resource type condition matches (if specified)
        IF v_policy.resource_conditions ? 'type' AND (v_policy.resource_conditions->>'type') != p_resource_type THEN
            CONTINUE;
        END IF;

        -- If policy conditions match:
        IF v_policy.effect = 'deny' THEN
            RETURN FALSE; -- Explicit DENY wins immediately
        ELSIF v_policy.effect = 'allow' THEN
            RETURN TRUE;  -- Explicit ALLOW matches
        END IF;
    END LOOP;

    RETURN FALSE; -- Default DENY when no matching policy grants access
END;
$$;

-- RLS Policies for RBAC / ABAC Tables
CREATE POLICY "Users view own assigned roles" ON rbac_user_roles
FOR SELECT TO authenticated
USING (user_id = (select auth.uid()));

CREATE POLICY "Admins manage rbac roles" ON rbac_roles
FOR ALL TO authenticated
USING (has_permission((select auth.uid()), 'platform.admin'));

CREATE POLICY "Admins manage rbac permissions" ON rbac_permissions
FOR ALL TO authenticated
USING (has_permission((select auth.uid()), 'platform.admin'));

CREATE POLICY "Admins manage abac policies" ON abac_policies
FOR ALL TO authenticated
USING (has_permission((select auth.uid()), 'security.manage'));
