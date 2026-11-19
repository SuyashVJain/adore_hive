import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Gift } from '@/lib/bag'
import type { PaymentMethod } from '@/lib/payment'

export interface OrderLine {
  productId: string
  /** Snapshots, so an order stays readable if the catalogue changes later */
  name: string
  image: string
  options: Record<string, string>
  qty: number
  unitPrice: number
  gift?: Gift
}

export interface OrderAddress {
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  state: string
  pin: string
  country: string
}

export interface Order {
  id: string
  createdAt: string
  // TODO: statuses come from the backend once there is one
  status: 'Awaiting confirmation' | 'Confirmed' | 'Shipped' | 'Delivered'
  email: string
  phone: string
  address: OrderAddress
  delivery: 'standard' | 'special'
  payment: PaymentMethod
  note: string
  lines: OrderLine[]
  totals: { subtotal: number; giftFees: number; shipping: number; total: number }
}

interface OrdersState {
  orders: Order[]
  place: (o: Order) => void
}

export const newOrderId = () => `AH-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      place: (o) => set((s) => ({ orders: [o, ...s.orders] })),
    }),
    {
      name: 'adore-orders',
      merge: (persisted, current) => {
        const orders = (persisted as Partial<OrdersState> | undefined)?.orders
        return { ...current, orders: Array.isArray(orders) ? orders.filter((o) => o && typeof o.id === 'string' && Array.isArray(o.lines)) : [] }
      },
    },
  ),
)
