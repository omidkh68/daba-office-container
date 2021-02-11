import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notification: Notification | null = null;
  private notification = new BehaviorSubject(this._notification);
  public currentNotification = this.notification.asObservable();

  changeCurrentNotification(notification: Notification | null) {
    this.notification.next(notification);
  }
}
