import { create } from 'zustand'

interface AuthState {
    user: string | null
    role: string | null
    setUser: (user: string, role: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    setUser: (user, role) => set({ user, role }),
    logout: () => set({ user: null, role: null }),
}))
