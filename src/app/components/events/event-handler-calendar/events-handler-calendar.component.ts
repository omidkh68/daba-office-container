import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {PopoverService} from '../../popover-widget/popover.service';
import {EventApiService} from '../logic/api.service';
import {DatetimeService} from '../../dashboard/dashboard-toolbar/time-area/service/datetime.service';
import {ServiceInterface} from '../../services/logic/service-interface';
import {EventHandlerService} from '../service/event-handler.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {TaskMorelistComponent} from '../../tasks/task-morelist/task-morelist.component';
import {EventHandlerSocketService} from '../service/event-handler-socket.service';
import {EventHandlerEmailDate, UserContainerInterface} from '../../users/logic/user-container.interface';
import {EventHandlerInterface, EventsReminderInterface} from '../logic/event-handler.interface';

@Component({
  selector: 'app-events-handler-calendar',
  templateUrl: './events-handler-calendar.component.html'
})
export class EventsHandlerCalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('picker') picker;
  @ViewChild('insideElement') insideElement;
  @ViewChild('dateCalendar') datePickerDirective: any;

  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  indexID: string;

  @Input()
  rtlDirection: boolean;

  @Input()
  serviceList: Array<ServiceInterface> = [];

  result: any;
  events_reminders: EventsReminderInterface = {events: [], reminders: []};
  datePickerConfig: any = null;
  currentDate: Date;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private elemRef: ElementRef,
              private eventApi: EventApiService,
              private viewDirection: ViewDirectionService,
              private popoverService: PopoverService,
              private datetimeService: DatetimeService,
              private eventHandlerService: EventHandlerService,
              private eventHandlerSocketService: EventHandlerSocketService,
              private windowManagerService: WindowManagerService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;
        this.setupCalendar();
      })
    );

    this._subscription.add(
      this.eventHandlerService.currentEventsReminderList.subscribe((events_reminder: EventsReminderInterface) => {
        if (events_reminder) {
          this.events_reminders.events = events_reminder.events;
          this.events_reminders.reminders = events_reminder.reminders;
        }
      })
    );
  }

  ngOnInit(): void {
    this.eventHandlerSocketService.initializeWebSocketConnection().then(result => {
      // console.log('socket status: ', result);
    });
  }

  ngAfterViewInit(): void {
    this.getEvents();
  }

  setupCalendar(): void {
    setTimeout(() => {
      this.datePickerConfig = {
        locale: this.rtlDirection ? 'fa' : 'en',
        dayBtnCssClassCallback: (event) => {
          this.dayBtnCssClassCallback(event)
        }
      };

      let goToDate = this.rtlDirection ? jalaliMoment(this.datetimeService.getDateByTimezoneReturnDate(new Date())) : moment(this.datetimeService.getDateByTimezoneReturnDate(new Date()));

      this.datePickerDirective.api.moveCalendarTo(goToDate);
    })
  }

  dayBtnCssClassCallback(event) {
    if (!this.events_reminders.events.length) {
      return;
    }

    setTimeout(() => {
      let date =
        this.rtlDirection ?
          event.locale('fa').format('YYYY/M/D') :
          event.locale('en').format('DD-MM-YYYY');

      let element: HTMLElement = document.querySelector('#' + this.indexID + ' .dp-calendar-day[data-date="' + date + '"]');

      if (element) {
        let count = 0;

        this.events_reminders.events.map(item => {
          let date: Date = this.datetimeService.getDateByTimezoneReturnDate(item.startDate);
          if (date.toLocaleDateString() == event._d.toLocaleDateString()) {
            if (count < 1) {
              element.insertAdjacentHTML('beforeend', '<div data-objects=\'' + JSON.stringify(item) + '\' class=\'event-point\'></div>');
            }
            count++;
          }
        });
      }
    });
  }

  eventClick(event) {
    let eventTemp = this.events_reminders.events.filter((item: EventHandlerInterface) => {
      let date: Date = this.datetimeService.getDateByTimezoneReturnDate(item.startDate);
      return date.toLocaleDateString() == event.date._d.toLocaleDateString();
    });

    if (eventTemp.length) {
      const data: any = {
        eventTemp: eventTemp,
        rtlDirection: this.rtlDirection
      };

      const dialogRef = this.dialog.open(TaskMorelistComponent, {
        data: data,
        autoFocus: false,
        width: '400px',
        height: '300px'
      });

      this._subscription.add(
        dialogRef.afterOpened().subscribe(() => {
          this.windowManagerService.dialogOnTop(dialogRef.id);
        })
      );

      this._subscription.add(
        dialogRef.afterClosed().subscribe((eventItems: EventHandlerInterface) => {
          if (eventItems) {
            if (eventItems.actionCallback && eventItems.actionCallback == 'add') {
              this.currentDate = this.datetimeService.getDateByTimezoneReturnDate(event.date._d);
              this.showEventHandlerWindow();
            } else {
              this.showEventHandlerWindow(eventItems);
            }
          }
        })
      );
    } else {
      this.currentDate = event.date._d;
      this.showEventHandlerWindow();
    }
  }

  showEventHandlerWindow(eventItems: EventHandlerInterface = null, openWindow: boolean = false) {
    if (openWindow) {
      this.eventHandlerService.moveDay(null);
    } else {
      this.eventHandlerService.moveDay(eventItems ? this.datetimeService.getDateByTimezoneReturnDate(eventItems.startDate) : this.currentDate);
    }

    this.eventHandlerService.moveEventItems(eventItems ? eventItems : null);

    if (this.serviceList) {
      let service: Array<ServiceInterface> = this.serviceList.filter(obj => {
        return obj.service_name == 'events_calendar'
      });
      this.windowManagerService.openWindowState(service[0])
    }
  }

  onNavigationClick(event) {
    this.getEvents(event.to._d);
  }

  getEvents(date: Date = null) {
    this.events_reminders.reminders = [];
    let finalDate = moment(this.datetimeService.getDateByTimezoneReturnDate(new Date())).format('YYYY-MM-DD');
    let goToDate = this.rtlDirection ? jalaliMoment(this.datetimeService.getDateByTimezoneReturnDate(new Date())) : moment(this.datetimeService.getDateByTimezoneReturnDate(new Date()));

    if (date) {
      finalDate = moment(this.datetimeService.getDateByTimezoneReturnDate(date)).format('YYYY-MM-DD');
      goToDate = this.rtlDirection ? jalaliMoment(this.datetimeService.getDateByTimezoneReturnDate(date)) : moment(this.datetimeService.getDateByTimezoneReturnDate(date));
    }

    let eventhandlerModel: EventHandlerEmailDate = {
      email: this.loggedInUser.email,
      date: finalDate
    };
    this.eventHandlerSocketService.getEventsByEmail(eventhandlerModel, this.loggedInUser).then((result: any) => {
      this.events_reminders = result;
      setTimeout(() => {
        this.datePickerDirective.api.moveCalendarTo(goToDate);
      })
    })
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

}
