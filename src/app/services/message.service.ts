import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageComponent} from '../components/message/message.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  _durationInSeconds = 3000;

  constructor(private _snackBar: MatSnackBar) {
  }

  set durationInSeconds(value: number) {
    this._durationInSeconds = value;
  }

  showMessage(title: string, type: string = '', duration: number | null = null) {
    const snackBar = this._snackBar.openFromComponent(MessageComponent, {
      data: title,
      duration: duration ? duration : this._durationInSeconds,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      politeness: 'polite',
      panelClass: type ? type : ''
    });

    setTimeout(() => {
      snackBar.dismiss();
    }, duration ? duration : this._durationInSeconds)
  }
}
