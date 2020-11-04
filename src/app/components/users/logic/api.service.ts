import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {AppConfig} from '../../../../environments/environment';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {CheckLoginInterface} from '../../login/logic/check-login.interface';
import {LoginResultInterface} from '../../login/logic/login.interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken: string = '';
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

  login(loginInfo): Observable<LoginResultInterface> {
    return this.http.post<LoginResultInterface>(`${this.API_URL}/login`, loginInfo);
  }

  checkLogin(): Observable<CheckLoginInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.get<CheckLoginInterface>(`${this.API_URL}/checkLogin${compId}`, this.headers);
  }

  logout(): Observable<any> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post(`${this.API_URL}/logout${compId}`, null, this.headers);
  }

  getHRUsers(): Observable<any> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.get(`${this.API_URL}/hr/users/subset${compId}`, this.headers);
  }

  getUserCompanies() {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get(`${this.API_URL}/users/company`, this.headers);
  }
}
