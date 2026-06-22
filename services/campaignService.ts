import type { Campaign, CampaignStatus } from '@/types';
import { createServerClient } from '@/lib/supabase-server';
import { auditService } from './auditService';

export interface ICampaignService {
  listActive(): Promise<Campaign[]>;
  listAll(): Promise<Campaign[]>;
  create(payload: Partial<Campaign>, adminId: string): Promise<Campaign>;
  update(id: string, payload: Partial<Campaign>, adminId: string): Promise<Campaign>;
  delete(id: string, adminId: string): Promise<void>;
  setStatus(id: string, status: CampaignStatus, adminId: string): Promise<Campaign>;
}

export class CampaignService implements ICampaignService {
  async listActive(): Promise<Campaign[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .lte('starts_at', new Date().toISOString())
      .gte('ends_at', new Date().toISOString());
    if (error) throw new Error(`CampaignService.listActive: ${error.message}`);
    return (data ?? []) as Campaign[];
  }

  async listAll(): Promise<Campaign[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(`CampaignService.listAll: ${error.message}`);
    return (data ?? []) as Campaign[];
  }

  async create(payload: Partial<Campaign>, adminId: string): Promise<Campaign> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('campaigns')
      .insert({ ...payload, created_by: adminId, status: payload.status ?? 'draft' })
      .select()
      .single();
    if (error) throw new Error(`CampaignService.create: ${error.message}`);

    await auditService.log({ userId: adminId, action: 'campaign.created', entity: 'campaigns', entityId: data.id, newData: payload });
    return data as Campaign;
  }

  async update(id: string, payload: Partial<Campaign>, adminId: string): Promise<Campaign> {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('campaigns').update(payload).eq('id', id).select().single();
    if (error) throw new Error(`CampaignService.update: ${error.message}`);

    await auditService.log({ userId: adminId, action: 'campaign.updated', entity: 'campaigns', entityId: id, newData: payload });
    return data as Campaign;
  }

  async delete(id: string, adminId: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (error) throw new Error(`CampaignService.delete: ${error.message}`);

    await auditService.log({ userId: adminId, action: 'campaign.deleted', entity: 'campaigns', entityId: id });
  }

  async setStatus(id: string, status: CampaignStatus, adminId: string): Promise<Campaign> {
    return this.update(id, { status }, adminId);
  }
}

export const campaignService = new CampaignService();
