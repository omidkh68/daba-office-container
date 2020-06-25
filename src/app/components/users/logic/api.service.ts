import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ChangeUserStatusInterface} from '../../status/logic/change-user-status.interface';
import {AppConfig} from '../../../../environments/environment';
import {UserInfoService} from '../services/user-info.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = AppConfig.API_URL;
  private CONTAINER_URL = AppConfig.CONTAINER_URL;

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
    return this._http.post(`${this.CONTAINER_URL}/login`, loginInfo, this.headers);
  }

  checkLogin(accessToken: string): Observable<any> {
    this.headers.headers = this.headers.headers.append('Authorization', accessToken);

    return this._http.get(`${this.CONTAINER_URL}/checkLogin`, this.headers);
  }
}
