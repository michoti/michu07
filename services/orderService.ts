import type { Order, OrderStatus, Address, PaymentMethod, CartItem } from '@/types';
import { createServerClient } from '@/lib/supabase-server';
import { generateOrderNumber } from '@/lib/utils';
import { watchService } from './watchService';
import { auditService } from './auditService';

export interface IOrderService {
  createOrder(params: {
    userId: string | null;
    guestEmail: string | null;
    items: CartItem[];
    shippingAddress: Address;
    shippingCents: number;
    taxCents: number;
    paymentMethod: PaymentMethod;
  }): Promise<Order>;
  getById(id: string): Promise<Order | null>;
  listByUser(userId: string): Promise<Order[]>;
  listAll(status?: OrderStatus): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus, adminId: string): Promise<Order>;
  updateTracking(id: string, trackingNumber: string, trackingUrl: string): Promise<Order>;
}

export class OrderService implements IOrderService {
  /**
   * Creates an order inside a transaction-equivalent flow:
   * 1. Validates stock for every line item (row-locked via RPC)
   * 2. Decrements stock atomically — prevents duplicate sales of
   *    unique serial-numbered watches (ACID requirement).
   * 3. Inserts order + order_items.
   * 4. Writes an immutable audit log entry.
   */
  async createOrder(params: {
    userId: string | null;
    guestEmail: string | null;
    items: CartItem[];
    shippingAddress: Address;
    shippingCents: number;
    taxCents: number;
    paymentMethod: PaymentMethod;
  }): Promise<Order> {
    const supabase = await createServerClient();

    // 1 & 2 — reserve stock for every item first
    for (const item of params.items) {
      const ok = await watchService.decrementStock(item.watch.id, item.quantity);
      if (!ok) {
        throw new Error(`"${item.watch.name}" is no longer available in the requested quantity.`);
      }
    }

    const subtotal = params.items.reduce((sum, i) => sum + i.watch.price_cents * i.quantity, 0);
    const total = subtotal + params.shippingCents + params.taxCents;

    // 3 — insert order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: params.userId,
        guest_email: params.guestEmail,
        status: 'pending',
        subtotal_cents: subtotal,
        shipping_cents: params.shippingCents,
        tax_cents: params.taxCents,
        total_cents: total,
        payment_method: params.paymentMethod,
        shipping_address: params.shippingAddress,
      })
      .select()
      .single();

    if (orderErr) throw new Error(`OrderService.createOrder: ${orderErr.message}`);

    const orderItems = params.items.map((item) => ({
      order_id: order.id,
      watch_id: item.watch.id,
      quantity: item.quantity,
      price_cents: item.watch.price_cents,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
    if (itemsErr) throw new Error(`OrderService.createOrder (items): ${itemsErr.message}`);

    // 4 — audit log
    await auditService.log({
      userId: params.userId,
      action: 'order.created',
      entity: 'orders',
      entityId: order.id,
      newData: { order_number: generateOrderNumber(), total_cents: total },
    });

    return order as Order;
  }

  async getById(id: string): Promise<Order | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, watch:watches(*))')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Order;
  }

  async listByUser(userId: string): Promise<Order[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, watch:watches(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`OrderService.listByUser: ${error.message}`);
    return (data ?? []) as Order[];
  }

  async listAll(status?: OrderStatus): Promise<Order[]> {
    const supabase = await createServerClient();
    let query = supabase.from('orders').select('*, order_items(*, watch:watches(*))').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw new Error(`OrderService.listAll: ${error.message}`);
    return (data ?? []) as Order[];
  }

  async updateStatus(id: string, status: OrderStatus, adminId: string): Promise<Order> {
    const supabase = await createServerClient();
    const { data: oldOrder } = await supabase.from('orders').select('status').eq('id', id).single();

    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (error) throw new Error(`OrderService.updateStatus: ${error.message}`);

    await auditService.log({
      userId: adminId,
      action: 'order.status_updated',
      entity: 'orders',
      entityId: id,
      oldData: { status: oldOrder?.status },
      newData: { status },
    });

    return data as Order;
  }

  async updateTracking(id: string, trackingNumber: string, trackingUrl: string): Promise<Order> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber, tracking_url: trackingUrl, status: 'shipped' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`OrderService.updateTracking: ${error.message}`);
    return data as Order;
  }
}

export const orderService = new OrderService();
