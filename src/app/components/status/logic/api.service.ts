import {AppConfig} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {StatusInfoInterface} from './status-interface';
import {StatusChangeResultInterface, StatusListResultInterface} from './result-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private API_URL = AppConfig.CONTAINER_URL + '/attendance';

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

  getStatuses(): Observable<StatusListResultInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<StatusListResultInterface>(`${this.API_URL}/statusList`, this.headers);
  }

  userChangeStatus(statusInfo: StatusInfoInterface): Observable<StatusChangeResultInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.patch<StatusChangeResultInterface>(`${this.API_URL}/userChangeStatus`, statusInfo, this.headers);
  }
}
