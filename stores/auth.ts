import { create } from "zustand";

type AuthStore = {
  token: string | null;
  setToken: (newToken: string) => void;
  clearToken: () => void;
};

export const useAuth = create<AuthStore>((set) => ({
  token: null,
  setToken: (newToken: string) => {
    set({ token: newToken });
  },
  clearToken: () => {
    set({ token: null });
  },
}));
