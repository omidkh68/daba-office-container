export interface StatusDetailInterface {
  id: number;
  label: string;
  label_fa: string;
  is_active: number;
  priority: number;
  icon: string;
  is_description: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserStatusInterface {
  id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  duration_time: number;
  status_detail?: StatusDetailInterface,
  description: string;
}

export interface StatusInfoInterface {
  user_id: number;
  status: number;
  description?: string;
}
