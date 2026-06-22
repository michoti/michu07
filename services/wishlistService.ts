import type { WishlistItem, WaitlistEntry } from '@/types';
import { createServerClient } from '@/lib/supabase-server';

export interface IWishlistService {
  list(userId: string): Promise<WishlistItem[]>;
  add(userId: string, watchId: string, priceAlertCents?: number): Promise<WishlistItem>;
  remove(userId: string, watchId: string): Promise<void>;
  setPriceAlert(userId: string, watchId: string, priceAlertCents: number): Promise<void>;
}

export class WishlistService implements IWishlistService {
  async list(userId: string): Promise<WishlistItem[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, watch:watches(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`WishlistService.list: ${error.message}`);
    return (data ?? []) as WishlistItem[];
  }

  async add(userId: string, watchId: string, priceAlertCents?: number): Promise<WishlistItem> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('wishlist')
      .upsert({ user_id: userId, watch_id: watchId, price_alert_cents: priceAlertCents ?? null }, { onConflict: 'user_id,watch_id' })
      .select('*, watch:watches(*)')
      .single();
    if (error) throw new Error(`WishlistService.add: ${error.message}`);
    return data as WishlistItem;
  }

  async remove(userId: string, watchId: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase.from('wishlist').delete().eq('user_id', userId).eq('watch_id', watchId);
    if (error) throw new Error(`WishlistService.remove: ${error.message}`);
  }

  async setPriceAlert(userId: string, watchId: string, priceAlertCents: number): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from('wishlist')
      .update({ price_alert_cents: priceAlertCents })
      .eq('user_id', userId)
      .eq('watch_id', watchId);
    if (error) throw new Error(`WishlistService.setPriceAlert: ${error.message}`);
  }
}

export interface IWaitlistService {
  join(email: string, watchId: string, userId?: string | null): Promise<WaitlistEntry>;
  listForWatch(watchId: string): Promise<WaitlistEntry[]>;
  markNotified(id: string): Promise<void>;
}

export class WaitlistService implements IWaitlistService {
  async join(email: string, watchId: string, userId: string | null = null): Promise<WaitlistEntry> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('waitlist')
      .upsert({ email, watch_id: watchId, user_id: userId }, { onConflict: 'email,watch_id' })
      .select()
      .single();
    if (error) throw new Error(`WaitlistService.join: ${error.message}`);
    return data as WaitlistEntry;
  }

  async listForWatch(watchId: string): Promise<WaitlistEntry[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('watch_id', watchId)
      .order('position', { ascending: true });
    if (error) throw new Error(`WaitlistService.listForWatch: ${error.message}`);
    return (data ?? []) as WaitlistEntry[];
  }

  async markNotified(id: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase.from('waitlist').update({ notified: true }).eq('id', id);
    if (error) throw new Error(`WaitlistService.markNotified: ${error.message}`);
  }
}

export const wishlistService = new WishlistService();
export const waitlistService = new WaitlistService();
