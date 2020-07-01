import {ExtensionInterface} from './extension.interface';

export interface ResultApiInterface {
  recordsCount: number;
  list: Array<ExtensionInterface>;
  success: string;
}
