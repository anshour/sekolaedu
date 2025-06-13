export interface Student {
  id: number;
  user_id: string;
  current_classroom_id: number | null;
  status: "active" | "candidate" | "graduated" | "dropped" | "transferred";
  created_at: string;
  updated_at: string;
}
