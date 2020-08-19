export interface LoginInterface {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface LoginResultInterface {
  success: boolean;
  data: LoginInterface;
}
