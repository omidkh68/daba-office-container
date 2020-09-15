import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatCalendar, MatCalendarCellCssClasses} from '@angular/material/datepicker';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {PopoverService} from '../../popover-widget/popover.service';
import {EventApiService} from '../../events/logic/api.service';
import {ReminderInterface} from '../../events/logic/event-reminder.interface';
import {EventHandlerService} from '../../events/service/event-handler.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ServiceItemsInterface} from '../logic/service-items.interface';
import {EventHandlerInterface} from '../../events/logic/event-handler.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {PopoverContnetComponent} from '../../popover-widget/popover/popover-content/popover-content.component';

@Component({
  selector: 'app-dashboard-datepicker',
  templateUrl: './dashboard-datepicker.component.html',
  styleUrls: ['./dashboard-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDatepickerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection: boolean;

  @Input()
  serviceList: ServiceItemsInterface[] = [];

  @ViewChild('myCalendar', {}) calendar: MatCalendar<Date>;
  @ViewChild('picker') picker;
  @ViewChild('insideElement') insideElement;

  popoverTarget: any;
  eventTemp: any = [];
  events: Array<EventHandlerInterface> = null;
  reminders: Array<ReminderInterface> = [];

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private elemRef: ElementRef,
              private eventApi: EventApiService,
              private popoverService: PopoverService,
              private eventHandlerService: EventHandlerService,
              private windowManagerService: WindowManagerService) {
  }

  ngOnInit(): void {
    this.getEvents();
  }

  ngAfterViewInit(): void {
    this._subscription.add(
      this.eventHandlerService.currentEventsList.subscribe(events => {
        this.events = events;
        setTimeout(() => {
          this.calendar.updateTodaysDate();
        }, 1000)
      })
    );
  }

  showEventHandlerWindow(event = null, $event = null) {
    if ($event)
      $event.stopPropagation();

    let date = null;
    if (event) {
      date = event.startDate !== undefined ? new Date(event.startDate) : event._d;
    }
    let eventItems = event && event.startDate !== undefined ? event : null;

    let service: ServiceItemsInterface[] = this.serviceList.filter(obj => {
      return obj.serviceTitle == 'events_calender'
    });

    this.eventHandlerService.moveEventItems(eventItems);
    this.eventHandlerService.moveDay(date);
    this.windowManagerService.openWindowState(service[0])
  }

  getPosition(event) {
    this.popoverTarget = event.target;
  }

  onSelect(event) {
    setTimeout(() => {
      this.eventTemp = this.events.filter((item: EventHandlerInterface) => {
        return new Date(item.startDate).toLocaleDateString() == event._d.toLocaleDateString();
      });
      if (this.eventTemp.length) {
        this.popoverService.open(PopoverContnetComponent, this.popoverTarget, {
          data: {
            eventTemp: this.eventTemp,
            events: this.events,
            serviceList: this.serviceList,
            windowManagerService: this.windowManagerService,
            rtlDirection: this.rtlDirection
          }
        }).afterClosed();

        this.windowManagerService.dialogOnTop('popover');
      } else {
        this.showEventHandlerWindow(event);
      }
    })
  }

  dateClass() {
    return (date: any): MatCalendarCellCssClasses => {
      let events = this.events;
      if (events)
        return events.some(item => new Date(item.startDate).toLocaleDateString() == date._d.toLocaleDateString()) ? 'special-date' : '';
      else
        return '';
    };
  }

  getEvents() {
    if (this.loggedInUser) {
      this._subscription.add(
        this.eventApi.getEventByEmail(this.loggedInUser.email).subscribe((resp: any) => {
          this.events = [];
          if (resp.status == 200) {
            if (resp.contents) {
              if (resp.contents.length) {
                this.events = resp.contents;
                this.eventHandlerService.moveEvents(this.events);
                this.prepareEventAndReminder();
              }
            }
          }
        })
      );
    }
  }

  prepareEventAndReminder() {
    this.events.map((item: EventHandlerInterface) => {
      item.sTime = new Date(item.startDate).toLocaleTimeString();
      item.eTime = new Date(item.endDate).toLocaleTimeString();
      if (item.reminders.length)
        this.reminders = [...this.reminders, ...item.reminders]
    });
    this.reminders.map((item: ReminderInterface) => {
      item.startdate_format = new Date(item.startReminder).toLocaleDateString();
      item.enddate_format = new Date(item.endReminder).toLocaleDateString();
    })
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
