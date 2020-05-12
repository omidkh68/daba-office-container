import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {BoardInterface} from './board-interface';
import {TaskInterface} from './task-interface';
import {FilterInterface} from './filter-interface';
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

  boards(userId: number): Observable<BoardInterface[]> {
    return this._http.get<BoardInterface[]>(`${this.API_URL}/boards/?userId=${userId}&page=-1`);
  }

  createTask(task: TaskInterface): Observable<TaskInterface> {
    return this._http.post<TaskInterface>(`${this.API_URL}/boards/add`, task, this.headers);
  }

  updateTask(task: TaskInterface): Observable<TaskInterface> {
    return this._http.patch<TaskInterface>(`${this.API_URL}/boards`, task, this.headers);
  }

  deleteTask(task: TaskInterface): Observable<TaskInterface> {
    return this._http.delete<TaskInterface>(`${this.API_URL}/boards/task/?taskId=${task.taskId}`, this.headers);
  }

  taskChangeStatus(task: TaskInterface, boardStatus: string): Observable<TaskInterface> {
    return this._http.post<TaskInterface>(`${this.API_URL}/boards/changeStatus`, {task, boardStatus}, this.headers);
  }

  filterTask(filters: FilterInterface): Observable<FilterInterface> {
    return this._http.post<FilterInterface>(`${this.API_URL}/boards/filter`, filters, this.headers);
  }

  taskStop(taskInfo: any): Observable<TaskInterface> {
    return this._http.post<TaskInterface>(`${this.API_URL}/boards/stopTask`, taskInfo, this.headers);
  }
}
