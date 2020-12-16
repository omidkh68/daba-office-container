import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';

export interface TaskInterface {
  taskId?: number;
  taskName: string;
  assignTo: UserInterface;
  taskDurationHours: number;
  taskDurationMinutes: number;
  startAt: string;
  stopAt: string;
  project: ProjectInterface;
  status?: number;
  taskDesc: string;
  userStartDate?: string;
  userEndDate?: string;
  percentage: number;
  assigner: string;
  taskDateStart: string;
  taskDateStop: string;
  boardStatus: string;
  trackable: number;
  todoCount?: number;
  creationDate?: string;
  overdue?: boolean;
  startTime?: string;
  stopTime?: string;
  email?: string;
  parentTaskId?: number | null;
  priority?: number;
}
