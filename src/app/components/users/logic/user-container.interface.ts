export interface UserContainerInterface {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role_id: number | null;
  timezone: string | null;
  extension: string;
}
