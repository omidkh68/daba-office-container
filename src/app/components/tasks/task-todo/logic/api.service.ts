import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {TodoInterface} from './todo-interface';
import {AppConfig} from '../../../../../environments/environment';

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

  getTodoList(taskId: number): Observable<TodoInterface[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.get<TodoInterface[]>(`${this.API_URL}/todo/?taskId=${taskId}`, this.headers);
  }

  createTodo(todo: any): Observable<TodoInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.post<TodoInterface>(`${this.API_URL}/todo/add`, todo, this.headers);
  }

  updateTodo(todo: any): Observable<TodoInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.patch<TodoInterface>(`${this.API_URL}/todo`, todo, this.headers);
  }

  toggleTodo(todoInfo: any): Observable<TodoInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.patch<TodoInterface>(`${this.API_URL}/todo/toggleTodo`, todoInfo, this.headers);
  }

  deleteTodo(todoInfo: any) {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this._http.delete(`${this.API_URL}/todo/?todoId=${todoInfo.todoId}&taskId=${todoInfo.taskId}`, this.headers);
  }
}
