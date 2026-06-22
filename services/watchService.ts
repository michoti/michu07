import type { Watch, WatchFilters, PaginatedResult } from '@/types';
import { createServerClient } from '@/lib/supabase-server';
import { DEFAULT_PAGE_SIZE } from '@/constants';

/**
 * IWatchService — interface for watch catalog operations.
 * Implemented by WatchService below; import the service into
 * server actions (src/actions/*) rather than calling Supabase directly.
 */
export interface IWatchService {
  list(filters: WatchFilters, page?: number): Promise<PaginatedResult<Watch>>;
  getById(id: string): Promise<Watch | null>;
  getFeatured(): Promise<Watch[]>;
  create(data: Partial<Watch>): Promise<Watch>;
  update(id: string, data: Partial<Watch>): Promise<Watch>;
  delete(id: string): Promise<void>;
  decrementStock(id: string, quantity: number): Promise<boolean>;
}

export class WatchService implements IWatchService {
  async list(filters: WatchFilters, page = 1): Promise<PaginatedResult<Watch>> {
    const supabase = await createServerClient();
    let query = supabase.from('watches').select('*', { count: 'exact' });

    if (filters.brand?.length) query = query.in('brand', filters.brand);
    if (filters.movement?.length) query = query.in('movement', filters.movement);
    if (filters.case_material?.length) query = query.in('case_material', filters.case_material);
    if (filters.condition?.length) query = query.in('condition', filters.condition);
    if (filters.min_price) query = query.gte('price_cents', filters.min_price * 100);
    if (filters.max_price) query = query.lte('price_cents', filters.max_price * 100);
    if (filters.search) query = query.textSearch('name', filters.search);

    switch (filters.sort) {
      case 'price_asc': query = query.order('price_cents', { ascending: true }); break;
      case 'price_desc': query = query.order('price_cents', { ascending: false }); break;
      case 'newest': query = query.order('created_at', { ascending: false }); break;
      default: query = query.order('is_featured', { ascending: false });
    }

    const from = (page - 1) * DEFAULT_PAGE_SIZE;
    const to = from + DEFAULT_PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw new Error(`WatchService.list: ${error.message}`);

    return {
      data: (data ?? []) as Watch[],
      total: count ?? 0,
      page,
      per_page: DEFAULT_PAGE_SIZE,
      total_pages: Math.ceil((count ?? 0) / DEFAULT_PAGE_SIZE),
    };
  }

  async getById(id: string): Promise<Watch | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('watches').select('*').eq('id', id).single();
    if (error) return null;
    return data as Watch;
  }

  async getFeatured(): Promise<Watch[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('watches')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .limit(6);
    if (error) throw new Error(`WatchService.getFeatured: ${error.message}`);
    return (data ?? []) as Watch[];
  }

  async create(payload: Partial<Watch>): Promise<Watch> {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('watches').insert(payload).select().single();
    if (error) throw new Error(`WatchService.create: ${error.message}`);
    return data as Watch;
  }

  async update(id: string, payload: Partial<Watch>): Promise<Watch> {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('watches').update(payload).eq('id', id).select().single();
    if (error) throw new Error(`WatchService.update: ${error.message}`);
    return data as Watch;
  }

  async delete(id: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase.from('watches').delete().eq('id', id);
    if (error) throw new Error(`WatchService.delete: ${error.message}`);
  }

  /**
   * Atomically decrement stock — prevents race conditions on
   * single-serial luxury items via row-level locking (RPC).
   */
  async decrementStock(id: string, quantity: number): Promise<boolean> {
    const supabase = await createServerClient();
    const { data, error } = await supabase.rpc('decrement_watch_stock', {
      watch_id: id,
      qty: quantity,
    });
    if (error) throw new Error(`WatchService.decrementStock: ${error.message}`);
    return Boolean(data);
  }
}

export const watchService = new WatchService();
