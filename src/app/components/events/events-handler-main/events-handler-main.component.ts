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
import {FullCalendarComponent} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
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

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
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
    calendarPlugins = [dayGridPlugin , interactionPlugin];
    calendarGooglePlugins = [dayGridPlugin , googleCalendarPlugin];
    buttonLabels = {};
    views = {};
    header = {};
    customButtons = {};
    slotLabelFormat = [{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }];
    currentDate: Date;
    googleCalendarEvents = {
        googleCalendarId: 'en.ir#holiday@group.v.calendar.google.com',
        className: 'gcal-event' // an option!
    };
/*    colorArray = [
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
    ]; */
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
                    let calendarApi = this.calendarComponent.getApi();
                    calendarApi.refetchEvents();
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

    ngAfterViewChecked() {
        let weekdayContainer = document.getElementsByClassName("holiday-date");
        if (!weekdayContainer.length) {
            this.taskCalendarService.setHolidayHighlight(this.holidays);
        }
    }

    changeViewMode(mode) {
        this.viewModeTypes = mode;
    }

    setupCalendar() {
        this.views = {
            dayGridMonthCustom: {
                type: 'dayGridMonth',
                buttonText: this.getTranslate('tasks.calendar.month')
            }
        };

        this.getTranslateWords().then((words: ButtonLabelsInterface) => {
            this.buttonLabels = {
                today: words.today,
                month: words.month,
                week: words.week,
                day: words.day,
                list: words.list
            };
        });

        if (this.rtlDirection) {
            this.header = {
                left: '',
                center: 'title',
                right: 'prev,next,today'
            };
        } else {
            this.header = {
                left: 'today,prev,next',
                center: 'title',
                right: ''
            };
        }
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
        }
        this.setupCalendar();
    }

    eventRender(event: any) {
        let tag = event.el.getElementsByClassName('fc-title');
        let myClass = this.rtlDirection ? 'left-0' : 'right-0';
        tag[0].insertAdjacentHTML('beforeBegin',
            '<span class="display-block custom-time-calendar '+ myClass +'">'+this.dateTimeService.formatTime(event.event._def.extendedProps.startDate)+'</span>');
    }

    getPosition(event) {
        this.popoverTarget = event.target;
    }

    onSelect(event) {
        setTimeout(() => {
            this.eventTemp = this.events_reminders.events.filter((item: EventHandlerInterface) => {
                return new Date(item.startDate).toLocaleDateString() == event._d.toLocaleDateString();
            });
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
                this.currentDate = event._d;
                this.loadBottomSheet(event);
            }
        })

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
        let eventItems = event?.startDate !== undefined ? event : null;
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
