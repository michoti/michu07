'use server';

import { revalidatePath } from 'next/cache';
import { appraisalService } from '@/services/appraisalService';
import type { Appraisal, AppraisalStatus } from '@/types';
import { ROUTES } from '@/constants';

export async function submitAppraisalAction(payload: Partial<Appraisal>) {
  const appraisal = await appraisalService.submit(payload);
  revalidatePath('/admin/appraisals');
  return appraisal;
}

export async function getUserAppraisalsAction(userId: string) {
  return appraisalService.listByUser(userId);
}

export async function getAllAppraisalsAction(status?: AppraisalStatus) {
  return appraisalService.listAll(status);
}

export async function reviewAppraisalAction(
  id: string,
  adminId: string,
  update: { status: AppraisalStatus; offerPriceCents?: number; adminNotes?: string }
) {
  const appraisal = await appraisalService.review(id, adminId, update);
  revalidatePath('/admin/appraisals');
  revalidatePath(ROUTES.APPRAISAL);
  return appraisal;
}
