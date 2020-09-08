import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {WindowManagerService} from "../../../services/window-manager.service";
import {ServiceItemsInterface} from "../logic/service-items.interface";
import {EventApiService} from "../../events/logic/api.service";
import {Subscription} from "rxjs";
import {EventHandlerInterface} from "../../events/logic/event-handler.interface";
import {ReminderInterface} from "../../events/logic/event-reminder.interface";
import {EventHandlerService} from "../../events/service/event-handler.service";
import {UserContainerInterface} from "../../users/logic/user-container.interface";
import {DashboardDatepickerService} from "./service/dashboard-datepicker.service";

@Component({
    selector: 'app-dashboard-datepicker',
    templateUrl: './dashboard-datepicker.component.html',
    styleUrls: ['./dashboard-datepicker.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardDatepickerComponent implements OnInit{


    @Input()
    loggedInUser: UserContainerInterface;

    eventTemp: any = [];
    popoverService;

    private events: Array<EventHandlerInterface> = null;
    private reminders: ReminderInterface[] = null;

    private _subscription: Subscription = new Subscription();
    constructor(
        private elemRef: ElementRef,
        private eventApi: EventApiService,
        private eventHandlerService: EventHandlerService) {
    }

    @ViewChild('picker') picker;

    @Input()
    rtlDirection: boolean;

    @Input()
    windowManagerService: WindowManagerService;

    @Input()
    serviceList: ServiceItemsInterface[] = [];


    openEventHandler(){
        this.onSelect(null)
    }

    showEventHandlerWindow(event = null , $event = null) {
        if($event)
            $event.stopPropagation();


        let date = null;
        if(event){
            date = event.startDate !== undefined ? new Date(event.startDate) : event._d;
        }
        let eventItems = event.startDate !== undefined ? event : null;

        let service: ServiceItemsInterface[] = this.serviceList.filter(obj => {
            return obj.serviceTitle == 'events_calender'
        });

        this.popoverService.closePopover();

        this.eventHandlerService.moveEvents(this.events);
        this.eventHandlerService.moveEventItems(eventItems);
        this.eventHandlerService.moveDay(date);
        this.eventHandlerService.moveReminders(this.reminders);
        this.windowManagerService.openWindowState(service[0])
    }

    onSelect(event) {

        this.eventTemp = this.events.filter((item: EventHandlerInterface)=>{
            return new Date(item.startDate).toLocaleDateString() == event._d.toLocaleDateString();
        });

        if(this.eventTemp.length){
            let date = event.jDate();
            this.popoverService.openPopover(date);
        }else{
            this.showEventHandlerWindow(event);
        }

    }

    dateClass() {
        return (date: any): MatCalendarCellCssClasses => {
            let events = this.events;
            return events.some(item => new Date(item.startDate).getDate() == date._d.getDate()) ? 'special-date' : ''
        };
    }

    ngOnInit(): void {

        this.popoverService = new DashboardDatepickerService(this.elemRef , 'datepicker-popover');

        this._subscription.add(
            this.eventApi.getEventByEmail(this.loggedInUser.email).subscribe((resp: any) => {
                if(resp.status == 200) {
                    if(resp.contents.length){
                        this.events = resp.contents;
                        this.events.map((item: EventHandlerInterface) => {
                            item.sTime = new Date(item.startDate).toLocaleTimeString();
                            item.eTime = new Date(item.endDate).toLocaleTimeString();
                            this.reminders = [...item.reminders]
                        });
                        this.reminders.map((item: ReminderInterface) => {
                            item.startdate_format = new Date(item.startReminder).toLocaleDateString();
                            item.enddate_format = new Date(item.endReminder).toLocaleDateString();
                        })
                    }else
                        this.events = [];
                }
                else {
                    this.events = [];
                }
            })
        );
    }
}
