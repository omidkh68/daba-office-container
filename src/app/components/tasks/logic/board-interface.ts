import {TaskInterface} from './task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {ActivityInterface} from '../task-activity/logic/activity-interface';

export interface BreadcrumbTaskInterface {
  taskId: number;
  taskName: string;
}

export interface BoardInterface {
  id: string;
  name: string;
  cols: number;
  rows: number;
  icon: string;
  tasks: Array<TaskInterface>;
}

export interface BoardsListResultInterface {
  page: string;
  recordCount: number;
  totalRecordCount: number;
  list: Array<TaskInterface>;
}

export interface ProjectsResultInterface {
  recordCount: number;
  list: Array<ProjectInterface>;
}

export interface UsersResultInterface {
  recordCount: number;
  list: Array<UserInterface>;
}

export interface ResultInterface {
  result: number;
  message: string;
  contents: {
    boards: BoardsListResultInterface;
    projects?: ProjectsResultInterface;
    users?: UsersResultInterface;
  };
}

export interface ResultTodoInterface {
  result: number;
  message: string;
  contents: Array<TaskInterface>;
}

export interface ResultTaskDetailInterface {
  result: number;
  message: string;
  content: TaskInterface;
}

export interface ResultBreadcrumbInterface {
  result: number;
  message: string;
  contents: Array<BreadcrumbTaskInterface>;
}

export interface ResultIncompleteTaskInterface {
  result: number;
  message: string;
  contents: Array<TaskInterface>;
}

export interface ResultTaskInterface {
  result: number;
  message: string;
  content: TaskInterface;
}

export interface ResultFilterInterface {
  result: number;
  message: string;
  contents: {
    boards: BoardsListResultInterface;
    projects: ProjectsResultInterface;
    users: UsersResultInterface;
  };
  recordCount: number;
}

export interface ResultChangePriorityInterface {
  result: number;
  message: string;
}

export interface TaskReportInterface {
  taskSheetId: number;
  taskDateStart: string;
  taskDateStop: string;
  percentage: number;
  adminIdStartTask: string | number;
  adminIdStopTask: string | number;
  description: string;
}

export interface ResultTaskReportInterface {
  contents: Array<TaskReportInterface>;
  message: string;
  recordCount: number;
  result: number;
}

export interface ResultTaskActivitiesInterface {
  contents: Array<ActivityInterface>;
  message: string;
  recordCount: number;
  result: number;
}

export interface TaskStopInterface {
  taskId: string;
  description: string;
  percentage: number;
  email: string;
}

export interface ResultTaskStopInterface {
  content: TaskInterface;
  message: string;
  result: number;
}

export interface UsersProjectsListInterface {
  usersList: Array<UserInterface>;
  projectsList: Array<ProjectInterface>;
}

export interface TaskReportDescriptionInterface {
  task: TaskInterface;
  description: string;
  percentage: number;
  taskDateStop: string;
}