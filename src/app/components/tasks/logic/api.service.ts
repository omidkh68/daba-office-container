import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {TaskInterface} from './task-interface';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TaskDurationInterface} from './task-duration-interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';
import {FilterInterface, ResultFilterCalendarDurationInterface} from './filter-interface';
import {
  ResultBreadcrumbInterface,
  ResultChangePriorityInterface,
  ResultFilterInterface,
  ResultIncompleteTaskInterface,
  ResultInterface, ResultTaskActivitiesInterface, ResultTaskDetailInterface,
  ResultTaskInterface, ResultTaskReportInterface, ResultTaskStopInterface, ResultTodoInterface, TaskStopInterface
} from './board-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private currentCompany: CompanyInterface = null;
  private API_URL = AppConfig.CONTAINER_URL + '/project';
  // private API_URL = AppConfig.API_URL;

  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json; charset=UTF-8'/*,
      'from': 'app_application'*/
    })
  };

  constructor(private http: HttpClient,
              private companySelectorService: CompanySelectorService) {
  }

  boards(email: string): Observable<ResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/?email=${email}&page=-1${compId}`, this.headers);
  }

  getTaskDetail(taskId: number): Observable<ResultTaskDetailInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultTaskDetailInterface>(`${this.API_URL}/boards/task/detail/?taskId=${taskId}${compId}`, this.headers);
  }

  boardsCalendar(email: string): Observable<ResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultInterface>(`${this.API_URL}/boards/calendar/?email=${email}&page=-1${compId}`, this.headers);
  }

  getTaskReport(taskId: number): Observable<ResultTaskReportInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultTaskReportInterface>(`${this.API_URL}/boards/getTaskReport?taskId=${taskId}${compId}`, this.headers);
  }

  boardsCalendarDurationTask(task: TaskDurationInterface): Observable<ResultFilterCalendarDurationInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<ResultFilterCalendarDurationInterface>(`${this.API_URL}/boards/calendar/durationTask${compId}`, task, this.headers);
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

  filterTask(filters: FilterInterface): Observable<ResultFilterInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<ResultFilterInterface>(`${this.API_URL}/boards/filter${compId}`, filters, this.headers);
  }

  taskStop(taskInfo: TaskStopInterface): Observable<ResultTaskStopInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.post<ResultTaskStopInterface>(`${this.API_URL}/boards/stopTask${compId}`, taskInfo, this.headers);
  }

  updateTask(task: TaskInterface): Observable<ResultTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    return this.http.patch<ResultTaskInterface>(`${this.API_URL}/boards${compId}`, task, this.headers);
  }

  deleteTask(task: TaskInterface, email: string): Observable<ResultTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.delete<ResultTaskInterface>(`${this.API_URL}/boards/task/?taskId=${task.taskId}&email=${email}${compId}`, this.headers);
  }

  getActivities(taskId: number): Observable<ResultTaskActivitiesInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultTaskActivitiesInterface>(`${this.API_URL}/boards/task/getActivities?taskId=${taskId}${compId}`, this.headers);
  }

  incompleteTasks(email: string): Observable<ResultIncompleteTaskInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultIncompleteTaskInterface>(`${this.API_URL}/boards/getIncompleteTasks/?email=${email}${compId}`, this.headers);
  }

  getBreadcrumb(taskId: number): Observable<ResultBreadcrumbInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultBreadcrumbInterface>(`${this.API_URL}/boards/getBreadcrumb/?taskId=${taskId}${compId}`, this.headers);
  }

  getSubsetTask(email: string, taskId: number): Observable<ResultTodoInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultTodoInterface>(`${this.API_URL}/boards/getSubsetTask/?taskId=${taskId}&email=${email}${compId}`, this.headers);
  }

  changePriority(todo: Array<TaskInterface>): Observable<ResultChangePriorityInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    const compId = this.currentCompany ? `?comp_id=${this.currentCompany.id}` : '';

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<ResultChangePriorityInterface>(`${this.API_URL}/boards/changePriority${compId}`, todo, this.headers);
  }
}
