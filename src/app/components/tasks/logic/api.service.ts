import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {TaskInterface} from './task-interface';
import {FilterInterface} from './filter-interface';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {ActivityInterface} from '../task-activity/logic/activity-interface';
import {TaskDurationInterface} from './task-duration-interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';
import {ResultIncompleteTaskInterface, ResultInterface, ResultTaskInterface} from './board-interface';
import {TodoInterface} from '../task-todo/logic/todo-interface';

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
  // todo: remove by ebi

  constructor(private http: HttpClient,
              private companySelectorService: CompanySelectorService) {
  }

  boards(email: string): Observable<ResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/?email=${email}&page=-1${compId}`, this.headers);
  }

  boardsCalendar(email: string): Observable<ResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/calendar/?email=${email}&page=-1${compId}`, this.headers);
  }

  getAllHolidays(): Observable<any[]> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.get<any[]>(`${this.API_URL}/boards/getAllHolidays${compId}`, this.headers);
  }

  getTaskReport(taskId: number): Observable<any> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<any>(`${this.API_URL}/boards/getTaskReport?taskId=${taskId}${compId}`, this.headers);
  }

  boardsCalendarDurationTask(task: TaskDurationInterface) {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<TaskDurationInterface>(`${this.API_URL}/boards/calendar/durationTask${compId}`, task, this.headers);
  }

  createTask(task: TaskInterface): Observable<ResultTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<ResultTaskInterface>(`${this.API_URL}/boards/add${compId}`, task, this.headers);
  }

  taskChangeStatus(task: TaskInterface, boardStatus: string): Observable<ResultTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<ResultTaskInterface>(`${this.API_URL}/boards/changeStatus${compId}`, {task, boardStatus}, this.headers);
  }

  filterTask(filters: FilterInterface): Observable<FilterInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<FilterInterface>(`${this.API_URL}/boards/filter${compId}`, filters, this.headers);
  }

  taskStop(taskInfo: any): Observable<TaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<TaskInterface>(`${this.API_URL}/boards/stopTask${compId}`, taskInfo, this.headers);
  }

  updateTask(task: TaskInterface): Observable<ResultTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.patch<ResultTaskInterface>(`${this.API_URL}/boards${compId}`, task, this.headers);
  }

  deleteTask(task: TaskInterface): Observable<ResultTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.delete<ResultTaskInterface>(`${this.API_URL}/boards/task/?taskId=${task.taskId}${compId}`, this.headers);
  }

  getActivities(taskId: number): Observable<ActivityInterface[]> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ActivityInterface[]>(`${this.API_URL}/boards/task/getActivities?taskId=${taskId}${compId}`, this.headers);
  }

  incompleteTasks(email: string): Observable<ResultIncompleteTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultIncompleteTaskInterface>(`${this.API_URL}/boards/getIncompleteTasks/?email=${email}${compId}`, this.headers);
  }

  getBreadcrumb(taskId: number): Observable<ResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/getBreadcrumb/?taskId=${taskId}${compId}`, this.headers);
  }

  getSubsetTask(email: string, taskId: number): Observable<ResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/getSubsetTask/?taskId=${taskId}&email=${email}${compId}`, this.headers);
  }

  changePriority(todo: TaskInterface[]): Observable<TodoInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<TodoInterface>(`${this.API_URL}/boards/changePriority${compId}`, todo, this.headers);
  }
}
