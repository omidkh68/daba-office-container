import {RoleInterface} from './role.interface';
import {ServiceInterface} from '../../services/logic/service-interface';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {UserStatusInterface} from '../../status/logic/status-interface';

export interface UserContainerInterface {
  id: number;
  name: string;
  email: string;
  timezone: string;
  status: number;
  services?: Array<ServiceInterface>,
  role?: RoleInterface;
  user_status: UserStatusInterface;
  lang: string;
  dark_mode: number;
  extension_no: number | null;
  profile_image: string | null;
  background_image: string | null;
  editable?: boolean;
  phoneNumber?: string;
  companies: Array<CompanyInterface>;
}

export interface EventHandlerEmailDate {
  email?: string
  date?: string;
}

export interface ResultSubsetUsersInterface {
  data: Array<UserContainerInterface>;
  success: boolean;
}

export interface ResultLogoutInterface {
  msg: string;
  success: boolean;
}
