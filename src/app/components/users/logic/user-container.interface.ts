import {RoleInterface} from './role.interface';
import {ServiceInterface} from '../../services/logic/service-interface';

export interface UserContainerInterface {
  id: number;
  name: string;
  email: string;
  timezone?: string | null;
  services?: ServiceInterface[],
  role?: RoleInterface;
}
