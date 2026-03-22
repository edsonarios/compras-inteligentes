import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKeys } from "@/lib/storage";
import type { User } from "@/lib/types";
import { authService } from "@/features/auth/services/authService";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async () => {
        const user = await authService.login();
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
