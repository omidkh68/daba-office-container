import {AppConfig} from '../../../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {TodoInterface, TodoTaskInterface} from './todo-interface';
import {CompanyInterface} from '../../../select-company/logic/company-interface';
import {CompanySelectorService} from '../../../select-company/services/company-selector.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private currentCompany: CompanyInterface = null;
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

  constructor(private http: HttpClient,
              private companySelectorService: CompanySelectorService) {
  }

  getTodoList(taskId: number): Observable<TodoInterface[]> {
    this.currentCompany = this.companySelectorService.currentCompany;

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<TodoInterface[]>(`${this.API_URL}/todo/?taskId=${taskId}${compId}`, this.headers);
  }

  createTodo(todo: TodoInterface): Observable<TodoInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<TodoInterface>(`${this.API_URL}/todo/add${compId}`, todo, this.headers);
  }

  updateTodo(todo: TodoInterface): Observable<TodoInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.patch<TodoInterface>(`${this.API_URL}/todo${compId}`, todo, this.headers);
  }

  changePriority(todo: TodoInterface[]): Observable<TodoInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.patch<TodoInterface>(`${this.API_URL}/todo/changePriority${compId}`, todo, this.headers);
  }

  deleteTodo(todoInfo: TodoTaskInterface) {
    this.currentCompany = this.companySelectorService.currentCompany;

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.delete(`${this.API_URL}/todo/?todoId=${todoInfo.todoId}&taskId=${todoInfo.taskId}${compId}`, this.headers);
  }
}
