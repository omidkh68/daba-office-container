import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {CheckLoginInterface} from '../../login/logic/check-login.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingService {
  public accessToken = '';
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

  constructor(private http: HttpClient) {
  }

  updateUser(userInfo, userId): Observable<CheckLoginInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);
    this.headers.headers = this.headers.headers.set('From', 'app_application');

    return this.http.patch<CheckLoginInterface>(`${this.API_URL}/users/${userId}`, userInfo, this.headers);
  }
}
