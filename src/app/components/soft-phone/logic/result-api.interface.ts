import {ExtensionInterface} from './extension.interface';
import {SoftphoneConferenceInterface} from './softphone-conference.interface';

export interface ResultApiInterface {
  recordsCount: number;
  data: Array<ExtensionInterface>;
  success: string;
  result: number;
  meta: any;
}

export interface ResultConfApiInterface {
  recordsCount: number;
  data: Array<SoftphoneConferenceInterface>
}
