import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
// import {UserInterface} from '../logic/user-interface';
import {LoginInterface} from '../logic/login.interface';
import {UserContainerInterface} from '../logic/user-container.interface';
import {ElectronService} from '../../../services/electron.service';

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

  // body = document.querySelector('html');

  changeUserInfo(user: UserContainerInterface) {
    /*if (user.darkMode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }*/

    this.userInfo.next(user);
  }

  changeAllUsers(users: Array<UserContainerInterface> | null) {
    this.allUsers.next(users);
  }

  /*changeDarkMode(user: UserInterface) {
    user.darkMode = user.darkMode ? 0 : 1;

    this.userInfo.next(user);

    if (user.darkMode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }
  }*/

  changeLoginData(loginData: LoginInterface | null) {
    this.loginData.next(loginData);
  }
}
