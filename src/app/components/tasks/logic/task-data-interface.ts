import {TaskInterface} from './task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {BoardInterface, BreadcrumbTaskInterface} from './board-interface';

export interface TaskDataInterface {
  action?: string;
  task?: TaskInterface;
  usersList: Array<UserInterface>;
  projectsList: Array<ProjectInterface>;
  boardStatus?: string;
  boardsList?: Array<BoardInterface>;
  breadCrumbList?: Array<BreadcrumbTaskInterface>;
}
