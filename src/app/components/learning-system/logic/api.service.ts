import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {JoinInterface, LmsInterface, LmsResultInterface} from './lms.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = AppConfig.LMS_API;

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

  getRooms(): Observable<LmsResultInterface> {
    return this.http.get<LmsResultInterface>(`${this.API_URL}/getRooms`, this.headers);
  }

  createRoom(room: LmsInterface): Observable<LmsResultInterface> {
    return this.http.post<LmsResultInterface>(`${this.API_URL}/createRoom`, room, this.headers);
  }

  join(info: JoinInterface): Observable<LmsResultInterface> {
    return this.http.post<LmsResultInterface>(`${this.API_URL}/join`, info, this.headers);
  }

  deleteRoom(roomId: number) {
    return this.http.delete<LmsResultInterface>(`${this.API_URL}/deleteRoom?roomId=${roomId}`, this.headers);
  }
}
