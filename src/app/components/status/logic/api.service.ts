import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {StatusInterface} from './status-interface';
import {AppConfig} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private API_URL = AppConfig.CONTAINER_URL + '/project';

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

  getStatuses(): Observable<StatusInterface[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<StatusInterface[]>(`${this.API_URL}/status/?page=-1`, this.headers);
  }
}
