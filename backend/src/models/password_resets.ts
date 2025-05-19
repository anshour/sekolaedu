export interface PasswordReset {
  id: number;
  user_id: number;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}