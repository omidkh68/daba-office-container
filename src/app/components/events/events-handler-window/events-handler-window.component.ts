import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WindowInterface} from '../../dashboard/logic/window.interface';
import {ServiceItemsInterface} from '../../dashboard/logic/service-items.interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  selector: 'app-events-handler-window',
  templateUrl: './events-handler-window.component.html'
})
export class EventsHandlerWindowComponent implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowInstance: WindowInterface;
  data: ServiceItemsInterface;
  @ViewChild('bottomSheet', {static: false}) bottomSheet: any;

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
        this.windowInstance = window.filter(item => item.windowService.serviceTitle === this.data.serviceTitle).pop();
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

  openButtonSheet(bottomSheetConfig: any) {
    try {
      bottomSheetConfig.bottomSheetRef = this.bottomSheet;

      this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
