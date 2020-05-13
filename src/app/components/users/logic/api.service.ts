import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ScreenshotInterface} from './screenshot-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //private API_URL = 'http://192.168.110.179:3000/api';
  private API_URL = 'http://localhost:3000/api';

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
}
