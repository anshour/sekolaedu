export interface Teacher {
  id: number;
  user_id: string;
  type: "regular" | "assistant";
  created_at: string;
  updated_at: string;
}
