import {ExtensionListInterface} from './extension-list.interface';

export interface ResultApiInterface {
  recordsCount: number;
  list: ExtensionListInterface[];
  success: string;
}
