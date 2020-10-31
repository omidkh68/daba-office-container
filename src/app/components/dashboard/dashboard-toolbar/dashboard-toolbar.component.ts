import {Component, Input, ViewEncapsulation} from '@angular/core';
import {WindowInterface} from '../logic/window.interface';
import {ServiceItemsInterface} from '../logic/service-items.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {EventHandlerInterface, EventsReminderInterface} from "../../events/logic/event-handler.interface";
import * as moment from "moment";
import {Subscription} from "rxjs/internal/Subscription";
import {EventHandlerService} from "../../events/service/event-handler.service";

@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardToolbarComponent {
  numberItem;
  @Input()
  rtlDirection: boolean;

  @Input()
  windowManager: Array<WindowInterface>;

  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  serviceList: Array<ServiceItemsInterface>;

  private _subscription: Subscription = new Subscription();

  constructor(private eventHandlerService: EventHandlerService,
  ) {
    this._subscription.add(
      this.eventHandlerService.currentEventsList.subscribe((test: EventHandlerInterface[]) => {
        if(test) {
          this.numberItem =  test.length
          console.log('bbbbbbrrrrrrr', this.numberItem);

        }
      })
    );
  }




}
