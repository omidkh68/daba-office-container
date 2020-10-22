import {TaskInterface} from './task-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {UserInterface} from '../../users/logic/user-interface';

export interface BoardInterface {
  id: string;
  name: string;
  cols: number;
  rows: number;
  tasks: TaskInterface[];
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
  content: {
    boards: BoardsListResultInterface;
    projects: ProjectsResultInterface;
    users: UsersResultInterface;
  };
}

export interface ResultIncompleteTaskInterface {
  result: number;
  message: string;
  contents: TaskInterface[];
}
