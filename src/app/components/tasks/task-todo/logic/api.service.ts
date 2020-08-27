import {AppConfig} from '../../../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {TodoInterface, TodoTaskInterface} from './todo-interface';

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

  constructor(private http: HttpClient) {
  }

  getTodoList(taskId: number): Observable<TodoInterface[]> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);
    this.headers.headers = this.headers.headers.set('From', 'app_application');

    return this.http.get<TodoInterface[]>(`${this.API_URL}/todo/?taskId=${taskId}`, this.headers);
  }

  createTodo(todo: TodoInterface): Observable<TodoInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<TodoInterface>(`${this.API_URL}/todo/add`, todo, this.headers);
  }

  updateTodo(todo: TodoInterface): Observable<TodoInterface> {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.patch<TodoInterface>(`${this.API_URL}/todo`, todo, this.headers);
  }

  deleteTodo(todoInfo: TodoTaskInterface) {
    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.delete(`${this.API_URL}/todo/?todoId=${todoInfo.todoId}&taskId=${todoInfo.taskId}`, this.headers);
  }
}
