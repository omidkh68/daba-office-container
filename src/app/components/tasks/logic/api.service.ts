import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {TaskInterface} from './task-interface';
import {ResultIncompleteTaskInterface, ResultInterface} from './board-interface';
import {FilterInterface} from './filter-interface';
import {TaskDurationInterface} from './task-duration-interface';
import {ActivityInterface} from '../task-activity/logic/activity-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private API_URL = AppConfig.CONTAINER_URL + '/project';
  //private API_URL = AppConfig.API_URL;

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

  boards(email: string): Observable<ResultInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/?email=${email}&page=-1`, this.headers);
  }

  boardsCalendar(email: string): Observable<ResultInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/calendar/?email=${email}&page=-1`, this.headers);
  }

  getAllHolidays(): Observable<any[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<any[]>(`${this.API_URL}/boards/getAllHolidays`, this.headers);
  }

  getTaskReport(taskId: number): Observable<any> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<any>(`${this.API_URL}/boards/getTaskReport?taskId=${taskId}`, this.headers);
  }

  boardsCalendarDurationTask(task: TaskDurationInterface) {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<TaskDurationInterface>(`${this.API_URL}/boards/calendar/durationTask`, task, this.headers);
  }

  createTask(task: TaskInterface): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<TaskInterface>(`${this.API_URL}/boards/add`, task, this.headers);
  }

  taskChangeStatus(task: TaskInterface, boardStatus: string): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<TaskInterface>(`${this.API_URL}/boards/changeStatus`, {task, boardStatus}, this.headers);
  }

  filterTask(filters: FilterInterface): Observable<FilterInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<FilterInterface>(`${this.API_URL}/boards/filter`, filters, this.headers);
  }

  taskStop(taskInfo: any): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<TaskInterface>(`${this.API_URL}/boards/stopTask`, taskInfo, this.headers);
  }

  updateTask(task: TaskInterface): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.patch<TaskInterface>(`${this.API_URL}/boards`, task, this.headers);
  }

  deleteTask(task: TaskInterface): Observable<TaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.delete<TaskInterface>(`${this.API_URL}/boards/task/?taskId=${task.taskId}`, this.headers);
  }

  getActivities(taskId: number): Observable<ActivityInterface[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<ActivityInterface[]>(`${this.API_URL}/boards/task/getActivities?taskId=${taskId}`, this.headers);
  }

  incompleteTasks(email: string): Observable<ResultIncompleteTaskInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);
    this.headers.headers = this.headers.headers.set('From', 'app_application');

    return this.http.get<ResultIncompleteTaskInterface>(`${this.API_URL}/boards/getIncompleteTasks/?email=${email}`, this.headers);
  }
}
