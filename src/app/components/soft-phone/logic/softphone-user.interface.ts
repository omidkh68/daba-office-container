// import {UserInterface} from '../../users/logic/user-interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';

export interface SoftphoneUserInterface extends UserContainerInterface {
  type?: string;
  date?: string;
  time?: string;
  // extension?: string;
  data?: any;
}
