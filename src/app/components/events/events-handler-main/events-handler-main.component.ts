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
import {MatDialog} from "@angular/material/dialog";
import {ViewDirectionService} from "../../../services/view-direction.service";
import {TranslateService} from "@ngx-translate/core";
import {ApiService} from "../../tasks/logic/api.service";
import {TaskCalendarService} from "../../tasks/task-calendar/services/task-calendar.service";
import {LoginDataClass} from "../../../services/loginData.class";
import {UserInfoService} from "../../users/services/user-info.service";
import {EventHandlerBottomSheetInterface, EventHandlerDataInterface} from "../logic/event-handler-data.interface";
import {EventHandlerDetailComponent} from "../event-handler-detail/event-handler-detail.component";
import {EventHandlerService} from "../service/event-handler.service";
import {EventHandlerInterface, EventsReminderInterface} from "../logic/event-handler.interface";
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {PopoverContnetComponent} from "../../popover-widget/popover/popover-content/popover-content.component";
import {PopoverService} from "../../popover-widget/popover.service";
import {WindowManagerService} from "../../../services/window-manager.service";
import {ButtonLabelsInterface} from "../../tasks/task-calendar/task-calendar-weekday/task-calendar-weekday.component";
import {EventHandlerSocketService} from "../service/event-handler-socket.service";
import {DatetimeService} from "../../dashboard/dashboard-toolbar/time-area/service/datetime.service";

@Component({
    selector: 'app-events-handler-main',
    templateUrl: './events-handler-main.component.html',
    styleUrls: ['./events-handler-main.component.scss']
})
export class EventsHandlerMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy, OnInit {

    @ViewChild('drawer') drawer: any; // the #calendar in the template
    @ViewChild('bottomSheet', {static: false}) bottomSheet: any;
    @ViewChild('myCalendar', {}) calendar: MatCalendar<Date>;

    @Input()
    rtlDirection: boolean;

    @Output()
    triggerBottomSheet: EventEmitter<EventHandlerBottomSheetInterface> = new EventEmitter<EventHandlerBottomSheetInterface>();

    viewModeTypes = 'container';
    events_reminders: EventsReminderInterface = {events:[] , reminders:[]};
    holidays = [];

    calendarEvents: any = [];
    eventItems: EventHandlerInterface = null;
    eventTemp: any = [];
    popoverTarget: any;
    showCalendar: boolean = false;
    currentDate: Date;
    datePickerConfig: any = {
        dayBtnCssClassCallback : (event) => {this.dayBtnCssClassCallback(event)}
    };
    colorArray = [
        '#4caf50'
    ];
    private _subscription: Subscription = new Subscription();

    constructor(public dialog: MatDialog,
                private api: ApiService,
                private injector: Injector,
                private userInfoService: UserInfoService,
                private eventHandlerSocketService: EventHandlerSocketService,
                private viewDirection: ViewDirectionService,
                private taskCalendarService: TaskCalendarService,
                private dateTimeService: DatetimeService,
                private eventHandlerService: EventHandlerService,
                private windowManagerService: WindowManagerService,
                private popoverService: PopoverService,
                private elemRef: ElementRef,
                private translateService: TranslateService) {
        super(injector, userInfoService);
    }

    dayBtnCssClassCallback(event){
        setTimeout(() => {
            let date =
                this.rtlDirection ?
                    event.locale('fa').format('YYYY/M/D') :
                    event.locale('en').format('DD-MM-YYYY');

            let element: HTMLElement = document.querySelector('.dp-calendar-day[data-date="'+date+'"]');

            if(element){
                let count = 0;
                this.calendarEvents.map(item => {
                    if(item.start.toLocaleDateString() == event._d.toLocaleDateString()){
                        if(count < 1){
                            element.insertAdjacentHTML('beforeend' , "<div class='custom-event-box'>"+item.name+"</div>");
                        }
                        count++;
                    }
                });
                if(count > 1){
                    element.insertAdjacentHTML('beforeend' , "<div class='custom-event-count'>+"+count+"</div>");
                }
            }
        })

    }

    ngOnInit(): void {

        this.getEvents();

        this._subscription.add(
            this.viewDirection.currentDirection.subscribe(direction => {
                this.rtlDirection = direction;
                this.setupCalendar();
            })
        );
        this._subscription.add(
            this.eventHandlerService.currentEventsReminderList.subscribe((events_reminders: EventsReminderInterface) => {
                this.events_reminders.events = events_reminders.events;
                this.events_reminders.reminders = events_reminders.reminders;

                setTimeout(() => {
                    this.calendar.updateTodaysDate();
                    this.prepareFullCalendar();
                }, 1000)
            })
        );
        this._subscription.add(
            this.eventHandlerService.currentDate.subscribe(day => this.currentDate = day)
        );
        this._subscription.add(
            this.eventHandlerService.currentEventItems.subscribe(currentEventItems => {
                if (this.currentDate){
                    setTimeout(() => {
                        this.eventItems = currentEventItems;
                        this.loadBottomSheet(this.eventItems);
                    },100)
                }

            })
        );
        this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
        this._subscription.add(
            this.api.getAllHolidays().subscribe((resp: any) => {
                resp.content.forEach((element: any) => {
                    this.holidays.push(element.date)
                })
            })
        );
    }

    ngAfterViewInit(): void {
        this.prepareFullCalendar();
        this.drawer.open();
    }

    changeViewMode(mode) {
        this.viewModeTypes = mode;
    }

    setupCalendar() {
        this.datePickerConfig.locale = this.rtlDirection ? 'fa' : 'en';
    }

    getTranslateWords() {
        return new Promise(async (resolve) => {
            const translate: ButtonLabelsInterface = {
                today: '',
                month: '',
                week: '',
                day: '',
                list: ''
            };

            await this.getTranslate('tasks.calendar.today').then((word: string) => translate.today = word);
            await this.getTranslate('tasks.calendar.month').then((word: string) => translate.month = word);
            await this.getTranslate('tasks.calendar.week').then((word: string) => translate.week = word);
            await this.getTranslate('tasks.calendar.day').then((word: string) => translate.day = word);
            await this.getTranslate('tasks.calendar.list').then((word: string) => translate.list = word);

            resolve(translate);
        });
    }

    getEvents() {
        this.eventHandlerSocketService.getEventsByEmail(this.loggedInUser).then((result: any) => {
            this._subscription.add(
                this.events_reminders = result
            );
        })
    }

    prepareFullCalendar() {
        if(this.events_reminders.events){
            this.events_reminders.events.map((item: any) => {
                item.title = item.name;
                item.start = new Date(item.startDate);
                item.end = new Date(item.endDate);
                item.color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
            });
            this.calendarEvents = this.events_reminders.events;
            this.showCalendar = true;
            //this.calendarComponent.options.events = this.calendarEvents;
        }
        this.setupCalendar();
    }

    getPosition(event) {
        this.popoverTarget = event.target;
    }

    onSelect(event) {
        let date = event.date && typeof event.date != 'function' ? event.date._d : event._d;
        this.eventTemp = this.events_reminders.events.filter((item: EventHandlerInterface) => {
            return new Date(item.startDate).toLocaleDateString() == date.toLocaleDateString();
        });
        //setTimeout(() => {
        if (this.eventTemp.length) {
            this.popoverService.open(PopoverContnetComponent, this.popoverTarget, {
                data: {
                    eventTemp: this.eventTemp,
                    events: this.events_reminders.events,
                    serviceList: null,
                    windowManagerService: null,
                    rtlDirection: this.rtlDirection
                }
            })
                .afterClosed()
                .subscribe(result => {
                    if (result) {
                        this.loadBottomSheet(result);
                    }
                });
            this.windowManagerService.dialogOnTop('popover');
        } else {
            this.currentDate = date;
            this.loadBottomSheet(event);
        }
        //},0)

    }

    nothing($event) {
        $event.jsEvent.preventDefault();
    }

    loadBottomSheetFromFullCalendar($event) {
        let event: EventHandlerInterface = $event.event._def.extendedProps;
        event = {...event, id: $event.event.id};
        this.loadBottomSheet(event)
    }

    loadBottomSheet(event = null, $event = null) {
        if ($event)
            $event.stopPropagation();

        let curdate = event && event.date && event.date.constructor === Date ? event.date : this.currentDate;
        this.currentDate = curdate ? curdate : new Date();
        let eventItems = event.startDate !== undefined ? event : null;
        let data: EventHandlerDataInterface = {
            action: 'add',
            eventItems: eventItems,
            currentDate: this.currentDate,
            events: this.events_reminders.events
        };
        let width = '50%';
        if(eventItems && eventItems.creatorUser.email == this.loggedInUser.email)
            width = '80%';

        this.triggerBottomSheet.emit({
            component: EventHandlerDetailComponent,
            height: '98%',
            width: width,
            data: data
        });
    }

    getTranslate(word) {
        return new Promise((resolve) => {
            const translate = this.translateService.instant(word);

            resolve(translate);
        });
    }

    dateClass() {
        return (date: any): MatCalendarCellCssClasses => {
            let events = this.events_reminders.events;
            return events.some(item => new Date(item.startDate).toLocaleDateString() == date._d.toLocaleDateString()) ? 'special-date' : ''
        };
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
