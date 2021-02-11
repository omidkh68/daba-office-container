import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {ElectronService} from '../../core/services';
import * as PackageJson  from '../../../../package.json';
import {ViewDirectionService} from '../../services/view-direction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  rtlDirection = false;
  version: string = '';

  private _subscription: Subscription = new Subscription();

  constructor(@Inject('windowObject') public window,
              private electronService: ElectronService,
              private viewDirection: ViewDirectionService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    if (this.electronService.isElectron) {
      this.version = this.electronService.remote.app.getVersion();
    } else {
      this.version = PackageJson.version;
    }
  }

  ngOnInit(): void {
    this.window.onbeforeunload = async () => {
      this.electronService.remote.app.quit();
      this.electronService.remote.app.exit(0);
    };
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
