import {UserStatusInterface} from '../../users/logic/user-status-interface';

export interface ChangeUserStatusInterface {
  userId: number;
  status?: UserStatusInterface;
  assigner: number;
  statusTime: string;
  description?: string;
}
