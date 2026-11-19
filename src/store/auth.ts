import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// TODO: replace this mock with real authentication (server-side accounts, sessions, email reset).
// Nothing here is secure: it lives in this browser's localStorage. The password itself is never stored,
// only a salted PBKDF2 digest as a non-reversible marker, so the mock flow still behaves like a real one.

export interface SavedAddress {
  id: string
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  state: string
  pin: string
}

export interface User {
  email: string
  name: string
  phone: string
  salt: string
  hash: string
  addresses: SavedAddress[]
}

interface AuthState {
  users: Record<string, User>
  current: string | null
  register: (name: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => void
  updateProfile: (patch: { name?: string; phone?: string }) => void
  addAddress: (a: Omit<SavedAddress, 'id'>) => void
  removeAddress: (id: string) => void
}

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')

async function digest(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations: 120_000, salt: new TextEncoder().encode(salt) }, key, 256)
  return hex(bits)
}

const norm = (email: string) => email.trim().toLowerCase()

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      users: {},
      current: null,
      register: async (name, email, password) => {
        const key = norm(email)
        if (get().users[key]) return { ok: false, error: 'An account with this email already exists. Try signing in.' }
        const salt = hex(crypto.getRandomValues(new Uint8Array(16)).buffer)
        const hash = await digest(password, salt)
        set((s) => ({ users: { ...s.users, [key]: { email: key, name: name.trim(), phone: '', salt, hash, addresses: [] } }, current: key }))
        return { ok: true }
      },
      login: async (email, password) => {
        const u = get().users[norm(email)]
        if (!u || (await digest(password, u.salt)) !== u.hash) return { ok: false, error: 'That email and password do not match. Please try again.' }
        set({ current: u.email })
        return { ok: true }
      },
      logout: () => set({ current: null }),
      updateProfile: (patch) =>
        set((s) => (s.current ? { users: { ...s.users, [s.current]: { ...s.users[s.current], ...patch } } } : s)),
      addAddress: (a) =>
        set((s) => {
          if (!s.current) return s
          const u = s.users[s.current]
          const dup = u.addresses.some((x) => x.address === a.address && x.pin === a.pin && x.firstName === a.firstName)
          return dup ? s : { users: { ...s.users, [u.email]: { ...u, addresses: [...u.addresses, { ...a, id: crypto.randomUUID() }] } } }
        }),
      removeAddress: (id) =>
        set((s) => {
          if (!s.current) return s
          const u = s.users[s.current]
          return { users: { ...s.users, [u.email]: { ...u, addresses: u.addresses.filter((a) => a.id !== id) } } }
        }),
    }),
    {
      name: 'adore-auth',
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AuthState>
        const users = p.users && typeof p.users === 'object' ? p.users : {}
        return { ...current, users, current: p.current && users[p.current] ? p.current : null }
      },
    },
  ),
)

export const useCurrentUser = () => useAuth((s) => (s.current ? s.users[s.current] ?? null : null))
