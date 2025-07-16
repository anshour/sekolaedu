export interface User {
  id: number;
  name: string;
  role_id: number | null;
  role_name: string | null;
  photo_url?: string | null;
  email: string;
  password?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}
