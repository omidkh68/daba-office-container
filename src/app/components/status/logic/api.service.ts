import {AppConfig} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {StatusInfoInterface} from './status-interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';
import {StatusChangeResultInterface, StatusListResultInterface} from './result-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private currentCompany: CompanyInterface = null;
  private API_URL = AppConfig.CONTAINER_URL + '/attendance';

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

  getStatuses(): Observable<StatusListResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<StatusListResultInterface>(`${this.API_URL}/statusList?comp_id=${this.currentCompany.id}`, this.headers);
  }

  userChangeStatus(statusInfo: StatusInfoInterface): Observable<StatusChangeResultInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.patch<StatusChangeResultInterface>(`${this.API_URL}/userChangeStatus?comp_id=${this.currentCompany.id}`, statusInfo, this.headers);
  }
}
