import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ActivityInterface} from './activity-interface';
import {AppConfig} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = AppConfig.API_URL;

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

  getActivities(taskId: number): Observable<ActivityInterface[]> {
    return this._http.get<ActivityInterface[]>(`${this.API_URL}/boards/task/getActivities?taskId=${taskId}`);
  }
}
