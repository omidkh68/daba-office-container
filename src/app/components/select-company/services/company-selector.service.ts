import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {CompanyInterface} from '../logic/company-interface';
import {ElectronService} from '../../../services/electron.service';

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
      const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

      const loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

      const loginData = this.electronService.fs.readFileSync(loginDataPath, 'utf8');

      if (loginData) {
        let data = JSON.parse(loginData);

        data = {...data, company: company};

        this.electronService.fs.writeFileSync(loginDataPath, JSON.stringify(data));

        resolve(true);
      }
    });
  }
}
