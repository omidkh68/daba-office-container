import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {WindowInterface} from '../../dashboard/logic/window.interface';
import {ServiceInterface} from '../../services/logic/service-interface';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  selector: 'app-web-browser-window',
  templateUrl: './web-browser-window.component.html'
})
export class WebBrowserWindowComponent implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowInstance: WindowInterface;
  data: ServiceInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private windowManagerService: WindowManagerService,
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

  close() {
    this.windowManagerService.closeWindow(this.data);
  }

  centerWindow() {
    this.windowManagerService.centerWindow();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
