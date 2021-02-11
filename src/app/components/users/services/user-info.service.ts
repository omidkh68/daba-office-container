import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {LoginInterface} from '../../login/logic/login.interface';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ElectronService} from '../../../core/services';
import {UserContainerInterface} from '../logic/user-container.interface';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  body = document.querySelector('html');

  private _userInfo: UserContainerInterface | null = null;
  private userInfo = new BehaviorSubject(this._userInfo);
  public currentUserInfo = this.userInfo.asObservable();
  private _loginData: LoginInterface | null = null;
  private loginData = new BehaviorSubject(this._loginData);
  public currentLoginData = this.loginData.asObservable();
  private _allUsers: Array<UserContainerInterface> | null = null;
  private allUsers = new BehaviorSubject(this._allUsers);
  public currentAllUsers = this.allUsers.asObservable();

  constructor(private electronService: ElectronService) {
  }

  get getUserInfo(): UserContainerInterface | null {
    return this.userInfo.getValue();
  }

  changeUserInfo(user: UserContainerInterface): void {
    if (user.dark_mode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }

    this.userInfo.next(user);
  }

  changeDarkMode(): void {
    const user = this.userInfo.getValue();

    user.dark_mode = user.dark_mode ? 0 : 1;

    this.userInfo.next(user);

    if (user.dark_mode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }
  }

  changeLoginData(loginData: LoginInterface | null): void {
    if (!loginData) {
      this.removeLoginDataFileContent();
    }

    this.loginData.next(loginData);
  }

  removeLoginDataFileContent(): void {
    if (this.electronService.isElectron) {
      const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

      const loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

      this.electronService.fs.writeFileSync(loginDataPath, '');
    } else {
      localStorage.removeItem('loginData');
    }
  }
}
