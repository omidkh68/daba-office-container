import {UserInterface} from '../../../users/logic/user-interface';

export interface ActivityInterface {
  logType: number;
  logText?: string;
  icon?: string;
  creationDate: string;
  user: UserInterface;
}
