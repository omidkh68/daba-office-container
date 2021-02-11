import {Component, Inject, Optional} from '@angular/core';
// import {PopoverRef} from '../../popover-ref';
// import {POPOVER_DATA} from '../../popover.service';
// import {DatetimeService} from '../../../dashboard/dashboard-toolbar/time-area/service/datetime.service';
// import {ServiceInterface} from '../../../services/logic/service-interface';
import {EventHandlerService} from '../../../events/service/event-handler.service';
import {DatetimeService} from '../../../dashboard/dashboard-toolbar/time-area/service/datetime.service';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover-content.component.html'
})
export class PopoverContentComponent {
  constructor(public dateTimeService: DatetimeService,
              private eventHandlerService: EventHandlerService) {
  }

  showEventHandlerWindow(event = null, $event = null) {
    /*if ($event)
      $event.stopPropagation();

    if (this.data.serviceList) {
      this.closeManually();
      let date = null;
      if (event) {
        date = event.startDate !== undefined ? new Date(event.startDate) : event._d;
      }
      const eventItems = event && event.startDate !== undefined ? event : null;

      const service: Array<ServiceInterface> = this.data.serviceList.filter(obj => {
        return obj.service_name == 'events_calendar';
      });

      this.eventHandlerService.moveEvents(this.data.events);
      this.eventHandlerService.moveEventItems(eventItems);
      this.eventHandlerService.moveDay(date);
      this.data.windowManagerService.openWindowState(service[0]);
    } else {
      this.closeManually(event);
    }*/
  }

  closeManually(data: any = null): void {
    // this.popoverRef.close(data);
  }
}
