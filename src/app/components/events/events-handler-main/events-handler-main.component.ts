import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../tasks/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {PopoverService} from '../../popover-widget/popover.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {DatetimeService} from '../../dashboard/dashboard-toolbar/time-area/service/datetime.service';
import {TranslateService} from '@ngx-translate/core';
import {TaskCalendarService} from '../../tasks/task-calendar/services/task-calendar.service';
import {EventHandlerService} from '../service/event-handler.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {TaskMorelistComponent} from '../../tasks/task-morelist/task-morelist.component';
import {EventHandlerEmailDate} from '../../users/logic/user-container.interface';
import {EventHandlerSocketService} from '../service/event-handler-socket.service';
import {EventHandlerDetailComponent} from '../event-handler-detail/event-handler-detail.component';
import {EventHandlerInterface, EventsReminderInterface} from '../logic/event-handler.interface';
import {EventHandlerBottomSheetInterface, EventHandlerDataInterface} from '../logic/event-handler-data.interface';

@Component({
  selector: 'app-events-handler-main',
  templateUrl: './events-handler-main.component.html',
  styleUrls: ['./events-handler-main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsHandlerMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('drawer') drawer: any;
  @ViewChild('bottomSheet', {static: false}) bottomSheet: any;
  @ViewChild('dateCalendar') datePickerDirective: any;

  @Input()
  rtlDirection: boolean;

  @Output()
  triggerBottomSheet: EventEmitter<EventHandlerBottomSheetInterface> = new EventEmitter<EventHandlerBottomSheetInterface>();

  viewModeTypes = 'container';
  events_reminders: EventsReminderInterface = {events: [], reminders: []};
  holidays = [];
  eventItems: EventHandlerInterface = null;
  currentDate: Date;
  datePickerConfig: any;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private api: ApiService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private eventHandlerSocketService: EventHandlerSocketService,
              private viewDirection: ViewDirectionService,
              private taskCalendarService: TaskCalendarService,
              private datetimeService: DatetimeService,
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
        this.setupCalendar();
      })
    );

    this._subscription.add(
      this.eventHandlerService.currentDate.subscribe(day => {
        if (day) {
          this.currentDate = day;
        }
      })
    );

    this._subscription.add(
      this.eventHandlerService.currentEventItems.subscribe(currentEventItems => {
        if (currentEventItems) {
          setTimeout(() => {
            this.eventItems = currentEventItems;
            this.loadBottomSheet(this.eventItems);
          }, 100)
        } else {
          if (this.currentDate) {
            this.loadBottomSheet();
          }
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
    this.drawer.open();
  }

  changeViewMode(mode) {
    this.viewModeTypes = mode;
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

      let element: HTMLElement = document.querySelector('.main-calendar .dp-calendar-day[data-date="' + date + '"]');

      if (element) {
        let count = 0;
        this.events_reminders.events.map(item => {
          if (this.datetimeService.getDateByTimezoneReturnDate(new Date(item.startDate)).toLocaleDateString() == event._d.toLocaleDateString()) {
            if (count < 1) {
              element.insertAdjacentHTML('beforeend', '<div class=\'custom-event-box\'>' + item.name + '</div>');
            }
            count++;
          }
        });
        if (count > 1) {
          element.insertAdjacentHTML('beforeend', '<div class=\'custom-event-count\'>+' + count + '</div>');
        }
      }
    })
  }

  setupCalendar() {
    this.datePickerConfig = {
      locale: this.rtlDirection ? 'fa' : 'en',
      dayBtnCssClassCallback: (event) => {
        this.dayBtnCssClassCallback(event)
      }
    };
  }

  getEvents() {
    let eventhandlerModel: EventHandlerEmailDate = {
      email: this.loggedInUser.email,
      date: moment(this.datetimeService.getDateByTimezoneReturnDate(new Date())).format('YYYY-MM-DD')
    };
    this.eventHandlerSocketService.getEventsByEmail(eventhandlerModel, this.loggedInUser).then((result: any) => {
      this._subscription.add(
        this.events_reminders = result
      );
      let goToDate = this.rtlDirection ?
        jalaliMoment(this.datetimeService.getDateByTimezoneReturnDate(new Date())) :
        moment(this.datetimeService.getDateByTimezoneReturnDate(new Date()));
      setTimeout(() => {
        this.datePickerDirective.api.moveCalendarTo(goToDate);
      })
    })
  }

  eventClick(event) {

    let eventTemp = this.events_reminders.events.filter((item: EventHandlerInterface) => {
      return new Date(item.startDate).toLocaleDateString() == event.date._d.toLocaleDateString();
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

      this.windowManagerService.dialogOnTop(dialogRef.id);

      this._subscription.add(
        dialogRef.afterClosed().subscribe((eventItems: EventHandlerInterface) => {
          if (eventItems) {
            if (eventItems.actionCallback && eventItems.actionCallback == 'add') {
              this.currentDate = this.datetimeService.getDateByTimezoneReturnDate(event.date._d);
              this.loadBottomSheet();
            } else {
              this.loadBottomSheet(eventItems);
            }
          }
        })
      );
    } else {
      setTimeout(() => {
        this.currentDate = event.date._d;
        this.loadBottomSheet();
      }, 500)
    }
  }

  setCurrentDate() {
    this.currentDate = new Date();
  }

  loadBottomSheet(eventItems: EventHandlerInterface = null) {
    let data: EventHandlerDataInterface = {
      action: 'add',
      eventItems: eventItems,
      currentDate: this.currentDate,
      events: this.events_reminders.events
    };
    let width = '50%';
    if (eventItems && eventItems.creatorUser.email == this.loggedInUser.email)
      width = '80%';

    setTimeout(() => {
      this.triggerBottomSheet.emit({
        component: EventHandlerDetailComponent,
        height: '98%',
        width: width,
        data: data
      });
    })

  }

  getTranslate(word) {
    return new Promise((resolve) => {
      const translate = this.translateService.instant(word);

      resolve(translate);
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
