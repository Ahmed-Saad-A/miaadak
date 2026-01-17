// src/store/userStore.ts
import { create } from "zustand";
import { Role } from "@/interfaces/roles";

interface UserUI {
  id: string;
  name: string;
  email: string;
  role: Role | null;
}

interface UserState {
  user: UserUI | null;
  setUser: (user: UserUI) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
