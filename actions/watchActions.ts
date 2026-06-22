'use server';

import { revalidatePath } from 'next/cache';
import { watchService } from '@/services/watchService';
import type { Watch, WatchFilters } from '@/types';
import { ROUTES } from '@/constants';

export async function getWatchesAction(filters: WatchFilters, page = 1) {
  return watchService.list(filters, page);
}

export async function getWatchByIdAction(id: string) {
  return watchService.getById(id);
}

export async function getFeaturedWatchesAction() {
  return watchService.getFeatured();
}

export async function createWatchAction(payload: Partial<Watch>) {
  const watch = await watchService.create(payload);
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_LISTINGS);
  return watch;
}

export async function updateWatchAction(id: string, payload: Partial<Watch>) {
  const watch = await watchService.update(id, payload);
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.PRODUCT(id));
  revalidatePath(ROUTES.ADMIN_LISTINGS);
  return watch;
}

export async function deleteWatchAction(id: string) {
  await watchService.delete(id);
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_LISTINGS);
}
