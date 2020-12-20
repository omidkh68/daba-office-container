import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import dayGridPlugin from '@fullcalendar/daygrid';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../../logic/task-interface';
import {UserInterface} from '../../../users/logic/user-interface';
import {TranslateService} from '@ngx-translate/core';
import {TaskDataInterface} from '../../logic/task-data-interface';
import {TaskDetailComponent} from '../../task-detail/task-detail.component';
import {TaskCalendarService} from '../services/task-calendar.service';
import {ViewDirectionService} from '../../../../services/view-direction.service';
import {TaskBottomSheetInterface} from '../../task-bottom-sheet/logic/TaskBottomSheet.interface';

export interface ButtonLabelsInterface {
  today: string;
  month: string;
  week: string;
  day: string;
  list: string;
}

@Component({
  selector: 'app-task-calendar-weekday',
  templateUrl: './task-calendar-weekday.component.html',
  styleUrls: ['./task-calendar-weekday.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarWeekdayComponent implements AfterViewInit, OnDestroy {
  @Input()
  calendarEvents: any;

  @Input()
  loginData: any;

  @Input()
  holidays: [];

  @Output()
  triggerBottomSheet: EventEmitter<TaskBottomSheetInterface> = new EventEmitter<TaskBottomSheetInterface>();

  rtlDirection: boolean;
  header = {};
  buttonLabels: ButtonLabelsInterface = {
    today: '',
    month: '',
    week: '',
    day: '',
    list: ''
  };
  slotLabelFormat = [{
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }];

  views = {};

  calendarPlugins = [dayGridPlugin];
  tasks: TaskInterface[] = [];
  options: any;

  usersList: UserInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private viewDirection: ViewDirectionService,
              private taskCalendarService: TaskCalendarService,
              private translateService: TranslateService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;

        this.setupCalendar();
      })
    );
  }

  ngAfterViewInit(): void {
    this.setupCalendar();
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
        left: 'timeGridMonth, timeGridWeek,timeGridDay',
        center: 'title',
        right: 'prev,next,today'
      };
    } else {
      this.header = {
        left: 'today,prev,next',
        center: 'title',
        right: 'timeGridMonth, timeGridWeek,timeGridDay'
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

  eventRender(event: any) {
    if (event.event.extendedProps.imageurl) {
      let tag = event.el.getElementsByClassName('fc-title');

      tag[0].insertAdjacentHTML('beforeBegin',
        '<img class="round-corner-all float-right" src="' + event.event.extendedProps.imageurl + '" width="20px" height="20px">');
    }
  }

  eventClick(event: any) {
    let boardStatus: any;

    const data: TaskDataInterface = {
      action: 'detail',
      usersList: event.event.extendedProps.usersList,
      projectsList: event.event.extendedProps.projectsList,
      task: event.event.extendedProps,
      boardStatus: boardStatus
    };

    this.triggerBottomSheet.emit({
      component: TaskDetailComponent,
      height: '98%',
      width: '98%',
      data: data
    });
  }

  getTranslate(word) {
    return new Promise((resolve) => {
      const translate = this.translateService.instant(word);

      resolve(translate);
    });
  }

  // ngAfterViewChecked() {
  //   let weekdayContainer = document.getElementsByClassName('holiday-date');
  //   if (!weekdayContainer.length) {
  //     this.taskCalendarService.setHolidayHighlight(this.holidays);
  //   }
  // }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
