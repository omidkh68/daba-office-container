import {Injectable} from '@angular/core';
import {LoginInterface} from '../../login/logic/login.interface';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserContainerInterface} from '../logic/user-container.interface';
import {AppConfig} from '../../../../environments/environment';
import {removeStorage} from "../../../services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  body = document.querySelector('html');

  private _userInfo: UserContainerInterface;
  private userInfo = new BehaviorSubject(this._userInfo);
  public currentUserInfo = this.userInfo.asObservable();
  private _loginData: LoginInterface | null = null;
  private loginData = new BehaviorSubject(this._loginData);
  public currentLoginData = this.loginData.asObservable();
  private _allUsers: Array<UserContainerInterface> | null = null;
  private allUsers = new BehaviorSubject(this._allUsers);
  public currentAllUsers = this.allUsers.asObservable();

  constructor() {
  }

  get getUserInfo(): UserContainerInterface {
    return this.userInfo.getValue();
  }

  changeUserInfo(user: UserContainerInterface) {
    if (user.dark_mode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }

    this.userInfo.next(user);
  }

  changeDarkMode() {
    const user = this.userInfo.getValue();

    user.dark_mode = user.dark_mode ? 0 : 1;

    this.userInfo.next(user);

    if (user.dark_mode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }
  }

  changeLoginData(loginData: LoginInterface | null) {
    if (!loginData) {
      this.removeLoginDataFileContent();
    }

    this.loginData.next(loginData);
  }

  removeLoginDataFileContent() {
    removeStorage('userData');
  }
}
