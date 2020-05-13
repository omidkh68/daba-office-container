import {RoleInterface} from '../../tasks/logic/role-interface';
import {UserStatusInterface} from './user-status-interface';

export interface UserInterface {
  adminId: number;
  username?: string;
  password?: string;
  name: string;
  family: string;
  email?: string;
  status?: string;
  permission?: string;
  darkMode?: number;
  role?: RoleInterface;
  userCurrentStatus?: UserStatusInterface | string;
  creationDate?: string;
}
