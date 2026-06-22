import { createServerClient } from '@/lib/supabase-server';

export interface AuditLogEntry {
  userId: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface IAuditService {
  log(entry: AuditLogEntry): Promise<void>;
}

/**
 * AuditService — writes immutable audit trail entries.
 * Used for all admin price updates, status changes, and
 * security-relevant actions (bans, role changes, refunds).
 */
export class AuditService implements IAuditService {
  async log(entry: AuditLogEntry): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase.from('audit_logs').insert({
      user_id: entry.userId,
      action: entry.action,
      entity: entry.entity ?? null,
      entity_id: entry.entityId ?? null,
      old_data: entry.oldData ?? null,
      new_data: entry.newData ?? null,
      ip_address: entry.ipAddress ?? null,
      user_agent: entry.userAgent ?? null,
    });
    // Audit logging failures should never block the primary action,
    // but should be surfaced for monitoring.
    if (error) console.error('[AuditService.log]', error.message);
  }
}

export const auditService = new AuditService();
