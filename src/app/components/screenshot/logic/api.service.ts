import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {ScreenshotInterface} from './screenshot-interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public accessToken = '';
  private currentCompany: CompanyInterface;
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

  userScreenshot(screenshotData: ScreenshotInterface): Observable<ScreenshotInterface> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.post<ScreenshotInterface>(`${this.API_URL}/userScreenshot?comp_id=${this.currentCompany.id}`, screenshotData, this.headers);
  }

  getTickTock(): Observable<string> {
    this.currentCompany = this.companySelectorService.currentCompany;

    this.headers.headers = this.headers.headers.set('Authorization', this.accessToken);

    return this.http.get<string>(`${this.API_URL}/userScreenshot/serverTickTock?comp_id=${this.currentCompany.id}`, this.headers);
  }
}
