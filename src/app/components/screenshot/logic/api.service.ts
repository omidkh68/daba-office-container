import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ScreenshotInterface} from './screenshot-interface';
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

  createScreenshot(screenshotData: ScreenshotInterface): Observable<ScreenshotInterface> {
    return this._http.post<ScreenshotInterface>(`${this.API_URL}/screenshots/add`, screenshotData, this.headers);
  }

  getTickTok() {
    return this._http.get(`${this.API_URL}/screenshots/serverTickTok`, this.headers);
  }
}