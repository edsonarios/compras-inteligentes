import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKeys } from "@/lib/storage";
import type { User } from "@/lib/types";
import { authService } from "@/features/auth/services/authService";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        const user = await authService.login(credentials);
        set({ user, isAuthenticated: true });
      },
      register: async (payload) => {
        const user = await authService.register(payload);
        set({ user, isAuthenticated: true });
      },
      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: storageKeys.auth
    }
  )
);
