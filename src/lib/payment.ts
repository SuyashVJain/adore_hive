// TODO: payment gateway integration (Razorpay / Cashfree / PayU etc.).
// This is a UI-only mock. It never receives, logs or stores card or UPI details:
// the checkout passes only the chosen method name, and the mock always succeeds.

export type PaymentMethod = 'UPI' | 'Card' | 'Other'

export async function mockPay(_method: PaymentMethod, _amount: number): Promise<{ ok: true }> {
  await new Promise((r) => setTimeout(r, 900))
  return { ok: true }
}
