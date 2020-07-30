export interface FilterInterface {
  userId: number;
  userImg: string;
  taskName?: string;
  projectId?: number;
  dateStart?: string;
  dateStop?: string;
  type?: string;
  adminId?: number;
  percentageStatus?: boolean
  email: string;
  status?: number;
}
