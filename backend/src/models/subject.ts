export interface Subject {
  id: number;
  classroom_id: number;
  classroom_name?: string; // Computed property from join
  teacher_id?: number | null;
  teacher_name?: string; // Computed property from join
  name: string;
  created_at: string;
  updated_at: string;
}
