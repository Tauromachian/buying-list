import { create } from "zustand";

type AuthStore = {
  token: string | null;
  setStoken: (newToken: string) => void;
};

export const useAuth = create<AuthStore>((set) => ({
  token: null,
  setStoken: (newToken: string) => {
    set({ token: newToken });
  },
}));
