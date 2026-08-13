import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/interfaces/roles";

interface User {
  id: string;
  name: string;
  role: Role | null;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User) => void;
  setRole: (role: Role | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      setUser: (user) =>
        set({ user, isAuthenticated: true, isInitialized: true }),

      setRole: (role) =>
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
          isInitialized: true,
        })),

      logout: () =>
        set({ user: null, isAuthenticated: false, isInitialized: true }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);
console.log("🚀 ~ useUserStore:", useUserStore)

