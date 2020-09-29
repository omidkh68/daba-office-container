import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {CompanyInterface} from '../logic/company-interface';

@Injectable({
  providedIn: 'root'
})
export class CompanySelectorService {
  private _companyList: Array<CompanyInterface> | null = null;
  private companyList = new BehaviorSubject(this._companyList);
  public currentCompanyList = this.companyList.asObservable();

  changeCompanyList(companyList: Array<CompanyInterface> | null) {
    this.companyList.next(companyList);
  }
}
