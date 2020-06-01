import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';

@Injectable({
  providedIn: 'root'
})
export class SoftPhoneUsersService {
  private _users: Array<SoftphoneUserInterface> | null;

  // set observable behavior to property
  private users = new BehaviorSubject(this._users);

  // observable property
  public currentSoftPhoneUsers = this.users.asObservable();

  changeSoftPhoneUsers(softPhoneUsers: Array<SoftphoneUserInterface> | null) {
    this.users.next(softPhoneUsers);
  }
}
