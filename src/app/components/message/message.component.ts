import {Component, Inject} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {ViewDirectionService} from '../../services/view-direction.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  title: string;
  rtlDirection: boolean;

  private _subscription: Subscription = new Subscription();

  constructor(public snackbarRef: MatSnackBarRef<MessageComponent>,
              private viewDirection: ViewDirectionService,
              @Inject(MAT_SNACK_BAR_DATA) public data: string) {
    this.title = data;

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }
}
