export interface CompanyInterface {
  id: number;
  name: string;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  subdomain: string;
}

export interface ResultCompanyListInterface {
  data: Array<CompanyInterface>;
  success: boolean;
}
