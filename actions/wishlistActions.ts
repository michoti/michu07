'use server';

import { revalidatePath } from 'next/cache';
import { wishlistService, waitlistService } from '@/services/wishlistService';
import { ROUTES } from '@/constants';

export async function getWishlistAction(userId: string) {
  return wishlistService.list(userId);
}

export async function addToWishlistAction(userId: string, watchId: string, priceAlertCents?: number) {
  const item = await wishlistService.add(userId, watchId, priceAlertCents);
  revalidatePath(ROUTES.WISHLIST);
  return item;
}

export async function removeFromWishlistAction(userId: string, watchId: string) {
  await wishlistService.remove(userId, watchId);
  revalidatePath(ROUTES.WISHLIST);
}

export async function setPriceAlertAction(userId: string, watchId: string, priceAlertCents: number) {
  await wishlistService.setPriceAlert(userId, watchId, priceAlertCents);
  revalidatePath(ROUTES.WISHLIST);
}

export async function joinWaitlistAction(email: string, watchId: string, userId?: string | null) {
  return waitlistService.join(email, watchId, userId ?? null);
}
