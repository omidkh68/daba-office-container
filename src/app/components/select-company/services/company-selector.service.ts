import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {CompanyInterface} from '../logic/company-interface';

@Injectable({
  providedIn: 'root'
})
export class CompanySelectorService {
  private _companyList: Array<CompanyInterface> = null;
  private companyList = new BehaviorSubject(this._companyList);
  public currentCompanyList = this.companyList.asObservable();

  private _selectedCompany: CompanyInterface = null;
  private selectedCompany = new BehaviorSubject(this._selectedCompany);
  // public currentSelectedCompany = this.selectedCompany.asObservable();

  changeCompanyList(companyList: Array<CompanyInterface>) {
    this.companyList.next(companyList);
  }

  changeSelectedCompany(selectedCompany: CompanyInterface) {
    this.selectedCompany.next(selectedCompany);
  }

  get currentCompany() {
    return this.selectedCompany.getValue();
  }
}
