import {TaskInterface} from './task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {BoardInterface} from './board-interface';

export interface TaskDataInterface {
  action?: string;
  task?: TaskInterface;
  usersList: UserInterface[];
  projectsList: ProjectInterface[];
  boardStatus?: string;
  boardsList?: BoardInterface[];
}
