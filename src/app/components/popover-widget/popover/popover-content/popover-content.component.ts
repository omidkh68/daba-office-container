import {Component, Inject, Optional} from '@angular/core';

import {POPOVER_DATA} from '../../popover.service';
import {PopoverRef} from '../../popover-ref';
import {ServiceItemsInterface} from "../../../dashboard/logic/service-items.interface";
import {EventHandlerService} from "../../../events/service/event-handler.service";

@Component({
    selector: 'app-popover-content',
    templateUrl: './popover-content.component.html'
})
export class PopoverContnetComponent {
    constructor(
        private eventHandlerService: EventHandlerService,
        private popoverRef: PopoverRef<string>,
        @Optional() @Inject(POPOVER_DATA) public data?: any
    ) {
    }

    showEventHandlerWindow(event = null, $event = null) {
        if ($event)
            $event.stopPropagation();


        if (this.data.serviceList) {
            this.closeManually();
            let date = null;
            if (event) {
                date = event.startDate !== undefined ? new Date(event.startDate) : event._d;
            }
            let eventItems = event && event.startDate !== undefined ? event : null;

            let service: ServiceItemsInterface[] = this.data.serviceList.filter(obj => {
                return obj.serviceTitle == 'events_calender'
            });

            this.eventHandlerService.moveEvents(this.data.events);
            this.eventHandlerService.moveEventItems(eventItems);
            this.eventHandlerService.moveDay(date);
            this.data.windowManagerService.openWindowState(service[0])
        } else {
            this.closeManually(event);
        }
    }

    closeManually(data: any = null): void {
        this.popoverRef.close(data);
    }
}
