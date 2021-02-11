import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {CheckLoginInterface} from '../../login/logic/check-login.interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingService {
  public accessToken = '';
  private currentCompany: CompanyInterface;
  private API_URL = AppConfig.CONTAINER_URL + '/hr';
  // private API_URL = AppConfig.API_URL;

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

  updateUser(userInfo, userId): Observable<CheckLoginInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.patch<CheckLoginInterface>(`${this.API_URL}/users/${userId}?comp_id=${this.currentCompany.id}`, userInfo, this.headers);
  }
}
