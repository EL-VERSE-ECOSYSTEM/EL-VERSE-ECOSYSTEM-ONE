export const DB_SCHEMA = 'public';
export function getTenantQuery(tenantId: string) {
  return { tenant_id: tenantId };
}
