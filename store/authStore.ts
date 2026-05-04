import { create } from "zustand";

import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

const TOKEN_KEY = "auth_token";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    set({ user, token });
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
  hydrate: () => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    set({ token });
  },
}));
