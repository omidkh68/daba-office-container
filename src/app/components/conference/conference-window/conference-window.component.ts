import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {WebViewService} from '../service/web-view.service';
import {WindowInterface} from '../../dashboard/logic/window.interface';
import {ServiceInterface} from '../../services/logic/service-interface';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  selector: 'app-conference-window',
  templateUrl: './conference-window.component.html'
})
export class ConferenceWindowComponent implements OnInit, OnDestroy {
  rtlDirection = false;
  windowInstance: WindowInterface;
  data: ServiceInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private webViewService: WebViewService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService) {
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

  activeWindow(): void {
    this.windowManagerService.activeWindow(this.data);
  }

  minimize(): void {
    this.windowManagerService.minimizeWindow(this.data);
  }

  maximize(): void {
    this.windowManagerService.maximizeWindow(this.data);
  }

  restore(): void {
    this.windowManagerService.restoreWindow(this.data);
  }

  close(): void {
    this.windowManagerService.closeWindow(this.data);
  }

  centerWindow(): void {
    this.windowManagerService.centerWindow();
  }

  reload(): void {
    this.webViewService.changeRefreshWebView(true);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
