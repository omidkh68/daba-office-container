import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageComponent} from '../components/message/message.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  _durationInSeconds = 3;

  constructor(private _snackBar: MatSnackBar) {
  }

  set durationInSeconds(value: number) {
    this._durationInSeconds = value;
  }

  showMessage(title: string, type: string = '', duration: number | null = null) {
    this._snackBar.openFromComponent(MessageComponent, {
      data: title,
      duration: duration ? duration : this._durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type ? type : ''
    });
  }
}
