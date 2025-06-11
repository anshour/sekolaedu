export interface User {
  id: number;
  name: string;
  role_id: number | null;
  role_name: string | null;
  email: string;
  password?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  permissions?: string[];
}
