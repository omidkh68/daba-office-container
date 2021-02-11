import {SoftphoneUserInterface} from './softphone-user.interface';

export interface SoftphoneConferenceInterface extends SoftphoneUserInterface {
  conf_id: string;
  conf_number: string;
  conf_name: string;
  comp_id: string;
  date: string;
  creator_type: string;
  creator_id: string;
  password: string;
}
