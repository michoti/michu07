import type { Appraisal, AppraisalStatus } from '@/types';
import { createServerClient } from '@/lib/supabase-server';
import { auditService } from './auditService';

export interface IAppraisalService {
  submit(payload: Partial<Appraisal>): Promise<Appraisal>;
  listByUser(userId: string): Promise<Appraisal[]>;
  listAll(status?: AppraisalStatus): Promise<Appraisal[]>;
  review(id: string, adminId: string, update: { status: AppraisalStatus; offerPriceCents?: number; adminNotes?: string }): Promise<Appraisal>;
}

export class AppraisalService implements IAppraisalService {
  async submit(payload: Partial<Appraisal>): Promise<Appraisal> {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('appraisals').insert({ ...payload, status: 'pending' }).select().single();
    if (error) throw new Error(`AppraisalService.submit: ${error.message}`);
    return data as Appraisal;
  }

  async listByUser(userId: string): Promise<Appraisal[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('appraisals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`AppraisalService.listByUser: ${error.message}`);
    return (data ?? []) as Appraisal[];
  }

  async listAll(status?: AppraisalStatus): Promise<Appraisal[]> {
    const supabase = await createServerClient();
    let query = supabase.from('appraisals').select('*, user:users(*)').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw new Error(`AppraisalService.listAll: ${error.message}`);
    return (data ?? []) as Appraisal[];
  }

  async review(
    id: string,
    adminId: string,
    update: { status: AppraisalStatus; offerPriceCents?: number; adminNotes?: string }
  ): Promise<Appraisal> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('appraisals')
      .update({
        status: update.status,
        offer_price_cents: update.offerPriceCents ?? null,
        admin_notes: update.adminNotes ?? null,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`AppraisalService.review: ${error.message}`);

    await auditService.log({
      userId: adminId,
      action: 'appraisal.reviewed',
      entity: 'appraisals',
      entityId: id,
      newData: update,
    });

    return data as Appraisal;
  }
}

export const appraisalService = new AppraisalService();
