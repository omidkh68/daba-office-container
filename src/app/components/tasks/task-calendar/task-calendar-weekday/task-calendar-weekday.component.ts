import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../../logic/task-interface';
import {UserInterface} from '../../../users/logic/user-interface';
import {PopoverService} from '../../../popover-widget/popover.service';
import {TranslateService} from '@ngx-translate/core';
import {TaskDataInterface} from '../../logic/task-data-interface';
import {TaskDetailComponent} from '../../task-detail/task-detail.component';
import {CalendarItemsInterface, TaskCalendarService} from '../services/task-calendar.service';
import {EventHandlerService} from '../../../events/service/event-handler.service';
import {ViewDirectionService} from '../../../../services/view-direction.service';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {TaskMorelistComponent} from '../../task-morelist/task-morelist.component';
import {TaskBottomSheetInterface} from '../../task-bottom-sheet/logic/TaskBottomSheet.interface';

@Component({
  selector: 'app-task-calendar-weekday',
  templateUrl: './task-calendar-weekday.component.html',
  styleUrls: ['./task-calendar-weekday.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarWeekdayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dateCalendar') datePickerDirective: any;

  @Output()
  triggerBottomSheet: EventEmitter<TaskBottomSheetInterface> = new EventEmitter<TaskBottomSheetInterface>();

  calendarEvents: Array<CalendarItemsInterface> = null;
  rtlDirection: boolean;
  tasks: TaskInterface[] = [];
  usersList: UserInterface[] = [];
  datePickerConfig: any = null;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private popoverService: PopoverService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private eventHandlerService: EventHandlerService,
              private taskCalendarService: TaskCalendarService,
              private windowManagerService: WindowManagerService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.eventHandlerService.currentEventsTaskList.subscribe((resp: any) => {
        if (resp) {
          this.calendarEvents = this.taskCalendarService.prepareTaskItems(resp);
          let goToDate =
            this.rtlDirection ? jalaliMoment.from(resp.filterData.dateStart, 'fa', 'YYYY/MM/DD') :
              moment(new Date(resp.filterData.dateStart));
          setTimeout(() => {
            this.datePickerDirective.api.moveCalendarTo(goToDate);
          })
        }
      })
    );
  }

  ngAfterViewInit() {
    this.getCalendarItemsData();
  }

  dayBtnCssClassCallback(event) {
    if (!this.calendarEvents) {
      return;
    }

    setTimeout(() => {
      let date =
        this.rtlDirection ?
          event.locale('fa').format('YYYY/M/D') :
          event.locale('en').format('DD-MM-YYYY');

      let element: HTMLElement = document.querySelector('.dp-calendar-day[data-date="' + date + '"]');

      if (element) {
        let count = 0;

        this.calendarEvents.map(item => {
            if (item.start.toLocaleDateString() == event._d.toLocaleDateString()) {
            if (count < 1) {
              element.insertAdjacentHTML('beforeend', '<div data-objects=\'' + JSON.stringify(item) + '\' style=\'background: ' + item.color + ' !important;\' class=\'custom-event-box\'><img src=\'' + item.imageurl + '\'>' + item.title + '</div>');
            }
            count++;
          }
        });

        if (count > 1) {
          element.insertAdjacentHTML('beforeend', '<div class="custom-event-count">+' + count + '</div>');
        }
      }
    });
  }

  getCalendarItemsData() {
    this._subscription.add(
        this.eventHandlerService.currentCalendarItems.subscribe((resp: Array<CalendarItemsInterface>) => {
          if (resp) {
            this.calendarEvents = resp;

            this.setupCalendar();
          }
        })
    );
  }

  setupCalendar(): void {
    let goToDate = this.rtlDirection ? jalaliMoment(new Date()) : moment(new Date());
    this.datePickerDirective.api.moveCalendarTo(goToDate);

    this.datePickerConfig = {
      locale: this.rtlDirection ? 'fa' : 'en',
      dayBtnCssClassCallback: (event) => {
        this.dayBtnCssClassCallback(event)
      }
    };
  }



  eventClick(event: any) {
    let eventTemp = this.calendarEvents.filter((item: CalendarItemsInterface) => {
      return item.start.toLocaleDateString() == event.date._d.toLocaleDateString();
    });

    if (eventTemp.length > 1) {
      const data: any = {
        eventTemp: eventTemp,
        rtlDirection: this.rtlDirection
      };

      const dialogRef = this.dialog.open(TaskMorelistComponent, {
        data: data,
        autoFocus: false,
        width: '250px',
        height: '250px'
      });

      this.windowManagerService.dialogOnTop(dialogRef.id);

      this._subscription.add(
        dialogRef.afterClosed().subscribe(eventItem => {
          if (eventItem) {
            this.loadTaskDetails(eventItem);
          }
        })
      );
    } else {
      let date =
        this.rtlDirection ?
          event.date.locale('fa').format('YYYY/M/D') :
          event.date.locale('en').format('DD-MM-YYYY');

      let element: HTMLElement = document.querySelector('.dp-calendar-day[data-date="' + date + '"] .custom-event-box');

      if (element && element.dataset) {
        let objects = JSON.parse(element.dataset.objects);
        this.loadTaskDetails(objects);
      }
    }
  }

  loadTaskDetails(eventItem) {
    let boardStatus: any;

    const data: TaskDataInterface = {
      action: 'detail',
      usersList: eventItem.usersList,
      projectsList: eventItem.projectsList,
      task: eventItem,
      boardStatus: boardStatus
    };

    this.triggerBottomSheet.emit({
      component: TaskDetailComponent,
      height: '98%',
      width: '98%',
      data: data
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
