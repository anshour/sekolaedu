import http from "@/utils/http";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AcademicYearStore {
  academicYear: null | {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
  };
  refetchAcademicYear: () => Promise<void>;
  isHydrated: boolean;
  onHydrated: () => void;
}

const useAcademicYear = create<AcademicYearStore>()(
  persist(
    (set, get) => ({
      academicYear: null,
      refetchAcademicYear: async () => {
        try {
          const academicYearData = await http
            .get("/academic-years/active")
            .then((res) => res.data);

          set({ academicYear: academicYearData });
        } catch (error: any) {
          console.error(error);
          set({ academicYear: null });
        }
      },
      isHydrated: false,
      onHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "academic-year-storage",
      onRehydrateStorage: () => (state, error) => {
        if (!error) {
          state?.onHydrated();
        }
      },
    }
  )
);

export default useAcademicYear;
