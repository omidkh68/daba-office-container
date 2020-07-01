import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ScreenshotInterface} from './screenshot-interface';
import {AppConfig} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  // private API_URL = AppConfig.API_URL;
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

  createScreenshot(screenshotData: ScreenshotInterface): Observable<ScreenshotInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<ScreenshotInterface>(`${this.API_URL}/screenshots/add`, screenshotData, this.headers);
  }

  getTickTok() {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get(`${this.API_URL}/screenshots/serverTickTok`, this.headers);
  }
}
