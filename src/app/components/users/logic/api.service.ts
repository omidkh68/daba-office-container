import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {AppConfig} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken: string = '';
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

  constructor(private http: HttpClient) {
  }

  login(loginInfo): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginInfo);
  }

  checkLogin(): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get(`${this.API_URL}/checkLogin`, this.headers);
  }

  logout(): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post(`${this.API_URL}/logout`, null, this.headers);
  }

  getHRUsers(): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get(`${this.API_URL}/hr/users`, this.headers);
  }

  getServiceUsers(serviceId: number): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get(`${this.API_URL}/users/${serviceId}`, this.headers);
  }
}
