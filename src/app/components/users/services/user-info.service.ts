import {Injectable} from '@angular/core';
import {LoginInterface} from '../../login/logic/login.interface';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserContainerInterface} from '../logic/user-container.interface';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private _userInfo: UserContainerInterface;
  private userInfo = new BehaviorSubject(this._userInfo);
  public currentUserInfo = this.userInfo.asObservable();

  private _loginData: LoginInterface | null = null;
  private loginData = new BehaviorSubject(this._loginData);
  public currentLoginData = this.loginData.asObservable();

  private _allUsers: Array<UserContainerInterface> | null = null;
  private allUsers = new BehaviorSubject(this._allUsers);
  public currentAllUsers = this.allUsers.asObservable();

  body = document.querySelector('html');

  public getUserInfo(): UserContainerInterface {
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

  changeAllUsers(users: Array<UserContainerInterface> | null) {
    this.allUsers.next(users);
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
    this.loginData.next(loginData);
  }
}
