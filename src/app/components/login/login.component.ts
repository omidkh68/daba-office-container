import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {ViewDirectionService} from '../../services/view-direction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  rtlDirection: boolean;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
