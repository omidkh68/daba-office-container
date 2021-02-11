import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserStatusInterface} from '../logic/status-interface';

@Injectable({
  providedIn: 'root'
})
export class ChangeStatusService {
  private _defaultUserStatus: UserStatusInterface | null = null;
  private userStatus = new BehaviorSubject(this._defaultUserStatus);
  public currentUserStatus = this.userStatus.asObservable();

  changeUserStatus(newUserStatus: UserStatusInterface | null): void {
    this.userStatus.next(newUserStatus);
  }

  get currentStatus(): UserStatusInterface {
    return this.userStatus.getValue();
  }
}
