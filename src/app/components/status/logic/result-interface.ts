import {StatusDetailInterface, UserStatusInterface} from './status-interface';

export interface StatusListResultInterface {
  success: boolean;
  data?: Array<StatusDetailInterface>;
}

export interface StatusChangeResultInterface {
  success: boolean;
  msg: string;
  data?: UserStatusInterface;
}
