import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notification: Notification | any;
  private notification = new BehaviorSubject(this._notification);
  public currentNotification = this.notification.asObservable();

  changeCurrentNotification(notification: Notification | any) {
    this.notification.next(notification);
  }
}
