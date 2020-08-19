import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {TaskInterface} from './task-interface';
import {BoardInterface} from './board-interface';
import {FilterInterface} from './filter-interface';
import {TaskDurationInterface} from './task-duration-interface';
import {ActivityInterface} from '../task-activity/logic/activity-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private API_URL = AppConfig.CONTAINER_URL + '/project';
  // private API_URL = AppConfig.API_URL;

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

  boards(email: string): Observable<BoardInterface[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);
    this.headers.headers = this.headers.headers.set('From', 'app_application');

    return this._http.get<BoardInterface[]>(`${this.API_URL}/boards/?email=${email}&page=-1`, this.headers);
  }

  boardsCalendar(email: string): Observable<BoardInterface[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<BoardInterface[]>(`${this.API_URL}/boards/calendar/?email=${email}&page=-1`, this.headers);
  }

  getTaskReport(taskId: number): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<any>(`${this.API_URL}/boards/getTaskReport?taskId=${taskId}`, this.headers);
  }

  boardsCalendarDurationTask(task: TaskDurationInterface) {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<TaskDurationInterface>(`${this.API_URL}/boards/calendar/durationTask`, task, this.headers);
  }

  createTask(task: TaskInterface): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<TaskInterface>(`${this.API_URL}/boards/add`, task, this.headers);
  }

  taskChangeStatus(task: TaskInterface, boardStatus: string): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<TaskInterface>(`${this.API_URL}/boards/changeStatus`, {task, boardStatus}, this.headers);
  }

  filterTask(filters: FilterInterface): Observable<FilterInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<FilterInterface>(`${this.API_URL}/boards/filter`, filters, this.headers);
  }

  taskStop(taskInfo: any): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<TaskInterface>(`${this.API_URL}/boards/stopTask`, taskInfo, this.headers);
  }

  updateTask(task: TaskInterface): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.patch<TaskInterface>(`${this.API_URL}/boards`, task, this.headers);
  }

  deleteTask(task: TaskInterface): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.delete<TaskInterface>(`${this.API_URL}/boards/task/?taskId=${task.taskId}`, this.headers);
  }

  getActivities(taskId: number): Observable<ActivityInterface[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<ActivityInterface[]>(`${this.API_URL}/boards/task/getActivities?taskId=${taskId}`, this.headers);
  }
}
