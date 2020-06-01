import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserStatusInterface} from '../../users/logic/user-status-interface';

@Injectable({
  providedIn: 'root'
})
export class ChangeStatusService {
  private _defaultUserStatus: UserStatusInterface | string;

  // set observable behavior to property
  private userStatus = new BehaviorSubject(this._defaultUserStatus);

  // observable property
  public currentUserStatus = this.userStatus.asObservable();

  changeUserStatus(newUserStatus: UserStatusInterface | string) {
    this.userStatus.next(newUserStatus);
  }
}
