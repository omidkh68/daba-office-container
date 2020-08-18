import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {
  ResultApiInterface,
  ResultConfApiInterface,
  ResultConfOnlineExtensionApiInterface
} from './result-api.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private API_URL = AppConfig.CONTAINER_URL + '/pbx';

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

  getExtensionList(): Observable<ResultApiInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<ResultApiInterface>(`${this.API_URL}/extension.php?action=extensions`, this.headers);
  }

  getExtensionStatus(): Observable<ResultApiInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<ResultApiInterface>(`${this.API_URL}/extension.php?action=extensionStatus`, this.headers);
  }

  getCdr(extension_no: string): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get(`${this.API_URL}/cdr.php?action=cdr&extensionNo=${extension_no}`, this.headers);
  }

  getConferenceList(): Observable<ResultConfApiInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<ResultConfApiInterface>(`${this.API_URL}/extension.php?action=conferenceList`, this.headers);
  }

  getConferenceOnlineUser(confNumber: string): Observable<ResultConfOnlineExtensionApiInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<ResultConfOnlineExtensionApiInterface>(`${this.API_URL}/extension.php?action=conferenceOnlineUser&phoneNumber=${confNumber}`, this.headers);
  }
}
