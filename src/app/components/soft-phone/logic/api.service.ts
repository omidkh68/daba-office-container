import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {
  ResultApiInterface,
  ResultConfApiInterface,
  ResultConfOnlineExtensionApiInterface, ResultMuteUnMuteApiInterface
} from './result-api.interface';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {MuteUnMuteInterface} from './extension.interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private currentCompany: CompanyInterface;
  private API_URL = AppConfig.CONTAINER_URL + '/pbx';

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

  getExtensionList(): Observable<ResultApiInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultApiInterface>(`${this.API_URL}/extension.php?action=extensions${compId}`, this.headers);
  }

  getExtensionStatus(): Observable<ResultApiInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultApiInterface>(`${this.API_URL}/extension.php?action=extensionStatus${compId}`, this.headers);
  }

  getCdr(extension_no: string): Observable<any> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get(`${this.API_URL}/cdr.php?action=cdr&extensionNo=${extension_no}${compId}`, this.headers);
  }

  getConferenceList(): Observable<ResultConfApiInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultConfApiInterface>(`${this.API_URL}/extension.php?action=conferenceList${compId}`, this.headers);
  }

  getConferenceOnlineUser(confNumber: string): Observable<ResultConfOnlineExtensionApiInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.get<ResultConfOnlineExtensionApiInterface>(`${this.API_URL}/extension.php?action=conferenceOnlineUser&phoneNumber=${confNumber}${compId}`, this.headers);
  }

  muteUnMute(muteInfo: MuteUnMuteInterface): Observable<ResultMuteUnMuteApiInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    const compId = this.currentCompany ? `&comp_id=${this.currentCompany.id}` : '';

    return this.http.post<ResultMuteUnMuteApiInterface>(`${this.API_URL}/extension.php?action=editMute${compId}`, muteInfo, this.headers);
  }
}
