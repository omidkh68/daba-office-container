import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ElectronService} from '../../services/electron.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  rtlDirection: boolean;
  version: string = '';

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private electronService: ElectronService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this.version = this.electronService.remote.app.getVersion();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
