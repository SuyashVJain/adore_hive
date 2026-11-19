export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

/** Indian mobile: 10 digits starting 6-9, with optional +91 / 0 prefix and spaces or dashes. */
export function normalisePhone(v: string) {
  const d = v.replace(/[\s\-()]/g, '').replace(/^(\+?91|0)/, '')
  return d
}
export const isPhone = (v: string) => /^[6-9]\d{9}$/.test(normalisePhone(v))

export const isPin = (v: string) => /^[1-9]\d{5}$/.test(v.trim())

/** name@bank style UPI ID */
export const isUpi = (v: string) => /^[a-zA-Z0-9._-]{2,}@[a-zA-Z][a-zA-Z0-9]{1,}$/.test(v.trim())

/** At least 8 characters with a letter and a number. */
export const passwordProblem = (v: string): string | null => {
  if (v.length < 8) return 'Use at least 8 characters.'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include at least one letter and one number.'
  return null
}

const luhn = (digits: string) => {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return sum % 10 === 0
}
export const isCardNumber = (v: string) => {
  const d = v.replace(/\s/g, '')
  return /^\d{13,19}$/.test(d) && luhn(d)
}
export function isCardExpiry(v: string, now = new Date()) {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.trim())
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}
export const isCvc = (v: string) => /^\d{3,4}$/.test(v.trim())

/** Email, or a phone / WhatsApp number with 10 to 13 digits (any country prefix). */
export function isEmailOrPhone(v: string) {
  const t = v.trim()
  if (isEmail(t)) return true
  const digits = t.replace(/\D/g, '')
  return /^[+\d][\d\s\-()]*$/.test(t) && digits.length >= 10 && digits.length <= 13
}
