import {CdrInterface} from './cdr.interface';

export interface CdrMetaInterface {
  total: string;
  current_page: number;
  per_page: number;
  from: number;
  to: number;
}

export interface CdrResultInterface {
  meta: CdrMetaInterface;
  recordsCount: number;
  data: Array<CdrInterface>;
  result: number;
  success: number;
}
