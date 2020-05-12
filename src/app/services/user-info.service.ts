import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserInterface} from '../components/users/logic/user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private _userInfo: UserInterface;

  // set observable behavior to property
  private userInfo = new BehaviorSubject(this._userInfo);

  // observable property
  public currentUserInfo = this.userInfo.asObservable();

  changeUserInfo(newUserStatus: UserInterface) {
    this.userInfo.next(newUserStatus);
  }
}
