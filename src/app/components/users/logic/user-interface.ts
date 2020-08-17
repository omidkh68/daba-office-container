import {RoleInterface} from '../../tasks/logic/role-interface';

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
  creationDate?: string;
}
