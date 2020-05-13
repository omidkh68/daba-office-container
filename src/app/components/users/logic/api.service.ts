import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ChangeUserStatusInterface} from '../../status/logic/change-user-status.interface';
import {AppConfig} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = AppConfig.apiUrl;

  /**
   * @type {HttpHeaders}
   */
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json; charset=UTF-8'
    })
  };

  constructor(private _http: HttpClient) {
  }

  applyStatusToUser(userStatus: ChangeUserStatusInterface): Observable<ChangeUserStatusInterface> {
    return this._http.post<ChangeUserStatusInterface>(`${this.API_URL}/users/applyStatusToUser`, userStatus, this.headers);
  }

  login(loginInfo): Observable<any> {
    return this._http.post(`${this.API_URL}/users/login`, loginInfo, this.headers);
  }
}
