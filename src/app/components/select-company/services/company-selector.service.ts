import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ElectronService} from '../../../core/services';
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
  public currentSelectedCompany = this.selectedCompany.asObservable();

  constructor(private electronService: ElectronService) {

  }

  get currentCompany(): CompanyInterface {
    return this.selectedCompany.getValue();
  }

  get currentCompanies(): Array<CompanyInterface> {
    return this.companyList.getValue();
  }

  changeCompanyList(companyList: Array<CompanyInterface>) {
    this.companyList.next(companyList);
  }

  changeSelectedCompany(selectedCompany: CompanyInterface) {
    this.changeCompanyFromLoggedInDataFile(selectedCompany).then(() => {
      this.selectedCompany.next(selectedCompany);
    });
  }

  changeCompanyFromLoggedInDataFile(company: CompanyInterface) {
    return new Promise((resolve) => {
      let loginData;
      let loginDataPath;

      if (this.electronService.isElectron) {
        const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

        loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

        loginData = this.electronService.fs.readFileSync(loginDataPath, 'utf8');
      } else {
        loginData = localStorage.getItem('loginData');
      }

      if (loginData) {
        let data = JSON.parse(loginData);

        data = {...data, company: company};

        if (this.electronService.isElectron) {
          this.electronService.fs.writeFileSync(loginDataPath, JSON.stringify(data));
        } else {
          localStorage.setItem('loginData', JSON.stringify(data));
        }

        resolve(true);
      }
    });
  }
}
