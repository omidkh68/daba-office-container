import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {CheckLoginInterface} from '../../login/logic/check-login.interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResultLogoutInterface, ResultSubsetUsersInterface} from './user-container.interface';
import {LoginInfoInterface, LoginResultInterface} from '../../login/logic/login.interface';
import {CompanyInterface, ResultCompanyListInterface} from '../../select-company/logic/company-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private currentCompany: CompanyInterface = null;
  private API_URL = AppConfig.CONTAINER_URL;

  /**
   * @type {HttpHeaders}
   */
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json; charset=UTF-8'
    })
  };

  constructor(private http: HttpClient,
              private companySelectorService: CompanySelectorService) {
  }

  login(loginInfo: LoginInfoInterface): Observable<LoginResultInterface> {
    return this.http.post<LoginResultInterface>(`${this.API_URL}/login`, loginInfo);
  }

  checkLogin(): Observable<CheckLoginInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.get<CheckLoginInterface>(`${this.API_URL}/checkLogin${compId}`, this.headers);
  }

  logout(): Observable<ResultLogoutInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<ResultLogoutInterface>(`${this.API_URL}/logout${compId}`, null, this.headers);
  }

  getHRUsers(): Observable<ResultSubsetUsersInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultSubsetUsersInterface>(`${this.API_URL}/users/subset${compId}`, this.headers);
  }

  getUserCompanies(): Observable<ResultCompanyListInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<ResultCompanyListInterface>(`${this.API_URL}/users/company`, this.headers);
  }
}
