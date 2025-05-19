export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}
