import { create } from "zustand";

import { apiFetch } from "@/lib/apiFetch";

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
};

type CurrentUserResponse = {
  success: boolean;
  data: {
    user: AuthUser;
  };
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
  hydrate: async () => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    set({ token });

    try {
      const result = await apiFetch<CurrentUserResponse>("/auth/me");
      set({ user: result.data.user });
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem(TOKEN_KEY);
    }
  },
}));
