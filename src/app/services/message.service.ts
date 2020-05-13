import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageComponent} from '../components/message/message.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  _durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) {
  }

  set durationInSeconds(value: number) {
    this._durationInSeconds = value;
  }

  showMessage(title: string) {
    this._snackBar.openFromComponent(MessageComponent, {
      data: title,
      duration: this._durationInSeconds * 1000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom'
    });
  }
}
