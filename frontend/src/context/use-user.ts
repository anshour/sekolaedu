import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: null | {
    id: number;
    name: string;
    role_id: number;
    role_name: string;
    email: string;
    photo: string;
    permissions?: string[];
  };
  clearUser: () => void;
  isAuthenticated: () => boolean;
  isHydrated: boolean;
  onHydrated: () => void;
}

const useUser = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      clearUser: () => set({ user: null }),
      isAuthenticated: () => get().user !== null,
      isHydrated: false,
      onHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state, error) => {
        if (!error) {
          state?.onHydrated();
        }
      },
    }
  )
);

export default useUser;
