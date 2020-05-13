import {StatusInterface} from '../../status/logic/status-interface';

export interface UserStatusInterface extends StatusInterface {
  statusStartDate: string;
  statusStopDate: string;
}
