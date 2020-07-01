import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  // private API_URL = AppConfig.API_URL;
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

  constructor(private _http: HttpClient) {
  }

  getExtensionList(): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get(`${this.API_URL}/pbx/extention.php?action=extention`, this.headers);
  }
}
