import {ConferenceOnlineExtensionInterface, ExtensionInterface} from './extension.interface';
import {SoftphoneConferenceInterface} from './softphone-conference.interface';

export interface ResultApiInterface {
  data: Array<ExtensionInterface>;
  recordsCount: number;
  success: string;
  result: number;
  meta: any;
}

export interface ResultConfApiInterface {
  data: Array<SoftphoneConferenceInterface>;
  recordsCount: number;
  success: string;
  result: number;
  meta: any;
}

export interface ResultConfOnlineExtensionApiInterface {
  data: Array<ConferenceOnlineExtensionInterface>;
  recordsCount: number;
  success: string;
  result: number;
  meta: any;
}
