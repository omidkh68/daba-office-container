import {UserContainerInterface} from './user-container.interface';

export interface CheckLoginInterface {
  success: boolean;
  data: UserContainerInterface
}
