import {CompanyInterface} from '../../select-company/logic/company-interface';

export interface LoginInterface {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  company?: CompanyInterface;
}

export interface LoginInfoInterface {
  username: string;
  password: string;
}

export interface LoginResultInterface {
  success: boolean;
  data: LoginInterface;
}
