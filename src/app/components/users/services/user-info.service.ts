import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserInterface} from '../logic/user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private _userInfo: UserInterface;
  private userInfo = new BehaviorSubject(this._userInfo);
  public currentUserInfo = this.userInfo.asObservable();
  body = document.querySelector('html');

  changeUserInfo(user: UserInterface) {
    if (user.darkMode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }

    this.userInfo.next(user);
  }

  changeDarkMode(user: UserInterface) {
    user.darkMode = user.darkMode ? 0 : 1;

    this.userInfo.next(user);

    if (user.darkMode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }
  }
}
