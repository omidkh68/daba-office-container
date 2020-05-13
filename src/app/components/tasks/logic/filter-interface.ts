export interface FilterInterface {
  userId: number;
  typeId: number;
  taskName?: string;
  projectId?: number;
  dateStart?: string;
  dateStop?: string;
  type?: string;
  adminId?: number;
  percentageStatus?: boolean
}
