import {RoleInterface} from '../../tasks/logic/role-interface';

export interface UserInterface {
  adminId: number;
  creationDate?: string;
  darkMode?: number;
  email?: string;
  family: string;
  name: string;
  role?: RoleInterface;
  username?: string;
}
