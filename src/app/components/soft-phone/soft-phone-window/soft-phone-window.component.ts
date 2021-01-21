import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {WindowInterface} from '../../dashboard/logic/window.interface';
import {SoftPhoneService} from '../service/soft-phone.service';
import {ServiceInterface} from '../../services/logic/service-interface';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  selector: 'app-soft-phone-window',
  templateUrl: './soft-phone-window.component.html'
})
export class SoftPhoneWindowComponent implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowInstance: WindowInterface;
  data: ServiceInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private windowManagerService: WindowManagerService,
              private softPhoneService: SoftPhoneService,
              private viewDirection: ViewDirectionService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this._subscription.add(
      this.windowManagerService.windowsList.subscribe(window => {
        this.windowInstance = window.filter(item => item.windowService.service_name === this.data.service_name).pop();
      })
    );
  }

  activeWindow() {
    this.windowManagerService.activeWindow(this.data);
  }

  minimize() {
    this.windowManagerService.minimizeWindow(this.data);
  }

  maximize() {
    this.windowManagerService.maximizeWindow(this.data);
  }

  restore() {
    this.windowManagerService.restoreWindow(this.data);
  }

  close(fromDestroy = false) {
    this.softPhoneService.changeCloseSoftphone(true).then(async () => {
      await this.softPhoneService.sipHangUp();

      await this.softPhoneService.sipUnRegister();

      if (!fromDestroy) {
        await this.windowManagerService.closeWindow(this.data);
      }
    });
  }

  centerWindow() {
    this.windowManagerService.centerWindow();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this.close(true);
  }
}
