'use server';

import { revalidatePath } from 'next/cache';
import { campaignService } from '@/services/campaignService';
import type { Campaign, CampaignStatus } from '@/types';

export async function getActiveCampaignsAction() {
  return campaignService.listActive();
}

export async function getAllCampaignsAction() {
  return campaignService.listAll();
}

export async function createCampaignAction(payload: Partial<Campaign>, adminId: string) {
  const campaign = await campaignService.create(payload, adminId);
  revalidatePath('/admin/campaigns');
  return campaign;
}

export async function updateCampaignAction(id: string, payload: Partial<Campaign>, adminId: string) {
  const campaign = await campaignService.update(id, payload, adminId);
  revalidatePath('/admin/campaigns');
  return campaign;
}

export async function deleteCampaignAction(id: string, adminId: string) {
  await campaignService.delete(id, adminId);
  revalidatePath('/admin/campaigns');
}

export async function setCampaignStatusAction(id: string, status: CampaignStatus, adminId: string) {
  const campaign = await campaignService.setStatus(id, status, adminId);
  revalidatePath('/admin/campaigns');
  return campaign;
}
