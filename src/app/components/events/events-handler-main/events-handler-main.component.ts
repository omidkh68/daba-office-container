import {
    AfterViewInit,
    Component, ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import dayGridPlugin from '@fullcalendar/daygrid';
import {MatDialog} from "@angular/material/dialog";
import {ViewDirectionService} from "../../../services/view-direction.service";
import {TranslateService} from "@ngx-translate/core";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {ApiService} from "../../tasks/logic/api.service";
import {TaskCalendarService} from "../../tasks/task-calendar/services/task-calendar.service";
import {LoginDataClass} from "../../../services/loginData.class";
import {UserInfoService} from "../../users/services/user-info.service";
import {EventHandlerBottomSheetInterface, EventHandlerDataInterface} from "../logic/event-handler-data.interface";
import {EventHandlerDetailComponent} from "../event-handler-detail/event-handler-detail.component";
import {EventHandlerService} from "../service/event-handler.service";
import {EventHandlerInterface} from "../logic/event-handler.interface";
import {ReminderInterface} from "../logic/event-reminder.interface";
import {MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {ServiceItemsInterface} from "../../dashboard/logic/service-items.interface";
import {DashboardDatepickerService} from "../../dashboard/dashboard-datepicker/service/dashboard-datepicker.service";

@Component({
    selector: 'app-events-handler-main',
    templateUrl: './events-handler-main.component.html',
    styleUrls: ['./events-handler-main.component.scss']
})
export class EventsHandlerMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy, OnInit {

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild('drawer') drawer: any; // the #calendar in the template
    @ViewChild('bottomSheet', {static: false}) bottomSheet: any;

    holidays = [];

    @Input()
    rtlDirection: boolean;
    calendarEvents:any = [];
    eventsList: Array<EventHandlerInterface> = null;
    eventItems: EventHandlerInterface = null;
    remindersList: Array<ReminderInterface> = null;
    eventTemp: any = [];
    popoverService;

    @Output()
    triggerBottomSheet: EventEmitter<EventHandlerBottomSheetInterface> = new EventEmitter<EventHandlerBottomSheetInterface>();

    currentDate: Date;
    colorArray = [
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#dbc00d',
        '#ffc107',
        '#ff9800',
        '#ff5722',
        '#795548',
        '#9e9e9e',
        '#ff9800',
        '#607d8b',
        '#444444',
    ];
    private _subscription: Subscription = new Subscription();
    calendarPlugins = [dayGridPlugin];

    buttonLabels = {};
    views = {};
    header = {};
    slotLabelFormat = [{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }];

    constructor(public dialog: MatDialog,
                private injector: Injector,
                private userInfoService: UserInfoService,
                private viewDirection: ViewDirectionService,
                private taskCalendarService: TaskCalendarService,
                private eventHandlerService: EventHandlerService,
                private api: ApiService,
                private elemRef: ElementRef,
                private translateService: TranslateService) {
        super(injector, userInfoService);
        this._subscription.add(
            this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
        );
        this._subscription.add(
            this.eventHandlerService.currentEventsList.subscribe(events => this.eventsList = events)
        );
        this._subscription.add(
            this.eventHandlerService.currentDate.subscribe(day => this.currentDate = day)
        );
        this._subscription.add(
            this.eventHandlerService.currentRemindersList.subscribe(reminders => this.remindersList = reminders)
        );
        this._subscription.add(
            this.eventHandlerService.currentEventItems.subscribe(currentEventItems => this.eventItems = currentEventItems)
        );
    }

    ngOnInit(): void {

        this.popoverService = new DashboardDatepickerService(this.elemRef , 'event-main-datepicker');
        this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
        this._subscription.add(
            this.api.getAllHolidays().subscribe((resp: any) => {
                resp.content.forEach((element: any) => {
                    this.holidays.push(element.date)
                })
            })
        );
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {

        this.loadBottomSheet(this.eventItems);

        this.eventsList.map((item: any) => {
            item.title = item.name;
            item.start = new Date(item.startDate);
            item.end = new Date(item.endDate);
            item.color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
        });
        this.calendarEvents = this.eventsList;


        this.views = {
            dayGridMonthCustom: {
                type: 'dayGridMonth',
                buttonText: this.getTranslate('tasks.calendar.month')
            }
        };

        this.drawer.open();

        this.buttonLabels = {
            today: this.getTranslate('tasks.calendar.today'),
            month: this.getTranslate('tasks.calendar.month'),
            week: this.getTranslate('tasks.calendar.week'),
            day: this.getTranslate('tasks.calendar.day'),
            list: this.getTranslate('tasks.calendar.list')
        };

        if (this.rtlDirection) {
            this.header = {
                left: 'title',
                center: '',
                right: 'prev,next today'
            };
        } else {
            this.header = {
                left: 'today next,prev',
                center: 'title',
                right: 'timeGridWeek,timeGridDay'
            };
        }
    }

    onSelect(event) {

        this.eventTemp = this.eventsList.filter((item: EventHandlerInterface)=>{
            return new Date(item.startDate).toLocaleDateString() == event._d.toLocaleDateString();
        });

        if(this.eventTemp.length){
            let date = event.jDate();
            this.popoverService.openPopover(date);
        }else{
            this.loadBottomSheet(event);
        }

    }

    loadBottomSheet(event = null , $event = null) {
        if($event)
            $event.stopPropagation();

        this.popoverService.closePopover();
        let eventItems = event?.startDate !== undefined ? event : null;
        let data: EventHandlerDataInterface = {
            action: 'add',
            eventItems : eventItems,
        };

        this.triggerBottomSheet.emit({
            component: EventHandlerDetailComponent,
            height: '98%',
            width: '98%',
            data: data
        });

        /*if($event)
            this.currentDate = $event._d;

        let event = this.eventsList.filter((item: EventHandlerInterface)=>{
            return new Date(item.startDate).toLocaleDateString() == this.currentDate.toLocaleDateString();
        })
        let data: EventHandlerDataInterface = {
            action: 'add',
            eventItems : event,
            remindersList : this.remindersList,
            currentDate : this.currentDate
        };

        this.dialog.open(EventHandlerDetailComponent, {
            data: data,
            autoFocus: false,
            width: '40%',
            height: '580px'
        });*/

    }

   /* showEventHandlerWindow(event = null , $event = null) {
        if($event)
            $event.stopPropagation();


        let date = null;
        if(event){
            date = event.startDate !== undefined ? new Date(event.startDate) : event._d;
        }
        let eventItems = event.startDate !== undefined ? event : null;

        let service: ServiceItemsInterface[] = this.serviceList.filter(obj => {
            return obj.serviceTitle == 'events_calender'
        })

        this.popoverService.closePopover();

    }*/

    getTranslate(word) {
        return this.translateService.instant(word);
    }

    dateClass() {
        return (date: any): MatCalendarCellCssClasses => {
            let events = this.eventsList;
            return events.some(item => new Date(item.startDate).getDate() == date._d.getDate()) ? 'special-date' : ''
        };
    }

    ngAfterViewChecked() {
        let weekdayContainer = document.getElementsByClassName("holiday-date");
        if (!weekdayContainer.length) {
            this.taskCalendarService.setHolidayHighlight(this.holidays);
        }
    }
}
