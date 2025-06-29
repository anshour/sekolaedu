export interface Classroom {
  id: number;
  name: string;
  academic_year_id: number;
  count_students: number;
  guardian_teacher_id: number | null;
  guardian_teacher_name?: string | null;
  created_at: string;
  updated_at: string;
}
