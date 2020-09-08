import {Injectable, OnDestroy} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageComponent} from '../components/message/message.component';
import {ViewDirectionService} from './view-direction.service';
import {WindowManagerService} from './window-manager.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {
  rtlDirection;
  _durationInSeconds = 3000;

  private _subscription: Subscription = new Subscription();

  constructor(private snackBar: MatSnackBar,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  set durationInSeconds(value: number) {
    this._durationInSeconds = value;
  }

  showMessage(title: string, type: string = '', duration: number | null = null) {
    const snackBar = this.snackBar.openFromComponent(MessageComponent, {
      data: title,
      duration: duration ? duration : this._durationInSeconds,
      horizontalPosition: this.rtlDirection ? 'right' : 'left',
      verticalPosition: 'bottom',
      politeness: 'polite',
      panelClass: type ? type : ''
    });

    this.windowManagerService.dialogOnTop('snackBar');

    setTimeout(() => snackBar.dismiss(), duration ? duration : this._durationInSeconds);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
