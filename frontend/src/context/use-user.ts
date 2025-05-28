import http from "@/utils/http";
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
  refetchUser: () => Promise<void>;
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
      refetchUser: async () => {
        try {
          const userData = await http
            .get("/auth/me")
            .then((res) => res.data?.user);

          set({ user: userData });
        } catch (error: any) {
          console.error(error);
          set({ user: null });
        }
      },
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
