import {UserContainerInterface} from '../../users/logic/user-container.interface';

export interface CheckLoginInterface {
  success: boolean;
  data: UserContainerInterface;
  meta?: any;
}
