'use server';

import { revalidatePath } from 'next/cache';
import { orderService } from '@/services/orderService';
import type { Address, CartItem, OrderStatus, PaymentMethod } from '@/types';
import { ROUTES } from '@/constants';

export async function createOrderAction(params: {
  userId: string | null;
  guestEmail: string | null;
  items: CartItem[];
  shippingAddress: Address;
  shippingCents: number;
  taxCents: number;
  paymentMethod: PaymentMethod;
}) {
  const order = await orderService.createOrder(params);
  revalidatePath(ROUTES.ORDER_HISTORY);
  revalidatePath(ROUTES.ADMIN_ORDERS);
  return order;
}

export async function getOrderAction(id: string) {
  return orderService.getById(id);
}

export async function getUserOrdersAction(userId: string) {
  return orderService.listByUser(userId);
}

export async function getAllOrdersAction(status?: OrderStatus) {
  return orderService.listAll(status);
}

export async function updateOrderStatusAction(id: string, status: OrderStatus, adminId: string) {
  const order = await orderService.updateStatus(id, status, adminId);
  revalidatePath(ROUTES.ADMIN_ORDERS);
  revalidatePath(ROUTES.ORDER_HISTORY);
  return order;
}

export async function updateOrderTrackingAction(id: string, trackingNumber: string, trackingUrl: string) {
  const order = await orderService.updateTracking(id, trackingNumber, trackingUrl);
  revalidatePath(ROUTES.ADMIN_ORDERS);
  revalidatePath(ROUTES.ORDER_HISTORY);
  return order;
}
