import {UserInterface} from '../../users/logic/user-interface';

export interface SoftphoneUserInterface extends UserInterface {
  type: string;
  date: string;
  time: string;
  extension: string;
  data?: any;
}
