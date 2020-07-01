import {RoleInterface} from './role.interface';
import {ServiceInterface} from '../../services/logic/service-interface';

export interface UserContainerInterface {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  timezone?: string | null;
  status?: number;
  extension?: string;
  services?: ServiceInterface[],
  role?: RoleInterface;
}
