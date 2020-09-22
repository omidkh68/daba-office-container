import {RoleInterface} from './role.interface';
import {ServiceInterface} from '../../services/logic/service-interface';
import {UserStatusInterface} from '../../status/logic/status-interface';

export interface UserContainerInterface {
  id: number;
  name: string;
  email: string;
  timezone: string;
  status: number;
  services?: ServiceInterface[],
  role?: RoleInterface;
  user_status: UserStatusInterface;
  lang: string;
  dark_mode: number;
  extension_no: number | null;
  profile_image: string | null;
  background_image: string | null;
  editable?: boolean;
  phoneNumber?: string;
}
