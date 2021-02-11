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

export interface CalendarDurationInterface {
  startDate: string;
  stopDate: string;
  timediff: string;
}

export interface TotalCalendarDurationInterface {
  timeSum: string;
}

export interface ResultFilterCalendarDurationInterface {
  content: {
    0: Array<CalendarDurationInterface>;
    1: TotalCalendarDurationInterface;
  };
  result: number;
}
