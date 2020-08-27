import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageComponent} from '../components/message/message.component';
import {ViewDirectionService} from './view-direction.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  _durationInSeconds = 3000;

  constructor(private snackBar: MatSnackBar,
              private viewDirection: ViewDirectionService) {
  }

  set durationInSeconds(value: number) {
    this._durationInSeconds = value;
  }

  showMessage(title: string, type: string = '', duration: number | null = null) {
    const snackBar = this.snackBar.openFromComponent(MessageComponent, {
      data: title,
      duration: duration ? duration : this._durationInSeconds,
      horizontalPosition: this.viewDirection ? 'right' : 'left',
      verticalPosition: 'bottom',
      politeness: 'polite',
      panelClass: type ? type : ''
    });

    setTimeout(() => {
      snackBar.dismiss();
    }, duration ? duration : this._durationInSeconds)
  }
}
