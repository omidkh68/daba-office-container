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

  constructor(private _http: HttpClient) {
  }

  userScreenshot(screenshotData: ScreenshotInterface): Observable<ScreenshotInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<ScreenshotInterface>(`${this.API_URL}/userScreenshot`, screenshotData, this.headers);
  }

  getTickTock(): Observable<string> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<string>(`${this.API_URL}/userScreenshot/serverTickTock`, this.headers);
  }
}
