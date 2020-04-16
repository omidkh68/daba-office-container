import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';

export interface TaskInterface {
  taskID: number;
  taskName: string;
  assignTo: UserInterface;
  taskDurationHours: number;
  taskDurationMinutes: number;
  startAt: string;
  stopAt: string;
  project: ProjectInterface;
  status: number;
  taskDesc: string;
  userStartDate?: string;
  userEndDate?: string;
  percentage: number;
  assigner: UserInterface;
  taskDateStart: string;
  taskDateStop: string;
  boardStatus?: string;
}
