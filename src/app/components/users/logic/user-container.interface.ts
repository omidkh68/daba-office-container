import {RoleInterface} from './role.interface';
import {ServiceInterface} from '../../services/logic/service-interface';
import {UserStatusInterface} from '../../status/logic/status-interface';

export interface UserContainerInterface {
  id: number;
  name: string;
  email: string;
  timezone?: string | null;
  status: number;
  services?: ServiceInterface[],
  role?: RoleInterface;
  user_status: UserStatusInterface;
  "password"?: string;
  "c_password"?: string;
  "lang"?:string;
  "dark_mode"?: number,
  "extension_no"?:number,
  "profile_image"?:string;
  "background_image"?:string;
}
