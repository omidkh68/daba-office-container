import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import dayGridPlugin from '@fullcalendar/daygrid';
import {Subscription} from 'rxjs/internal/Subscription';
import timeGridPlugin from '@fullcalendar/timegrid';
import {TaskInterface} from '../../logic/task-interface';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../../services/view-direction.service';
import {LoginInterface} from '../../../users/logic/login.interface';
import {TaskDataInterface} from "../../logic/task-data-interface";
import {TaskDetailComponent} from "../../task-detail/task-detail.component";
import {TaskBottomSheetInterface} from "../../task-bottom-sheet/logic/TaskBottomSheet.interface";
import {UserInterface} from "../../../users/logic/user-interface";

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

  @Output()
  triggerBottomSheet: EventEmitter<TaskBottomSheetInterface> = new EventEmitter<TaskBottomSheetInterface>();

  rtlDirection: boolean;
  header = {};
  buttonLabels = {};
  slotLabelFormat = [{
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }];

  views = {};

  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  tasks: TaskInterface[] = [];
  options: any;

  usersList: UserInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private viewDirection: ViewDirectionService,
              private translateService: TranslateService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngAfterViewInit(): void {
    this.views = {
      dayGridMonthCustom: {
        type: 'dayGridMonth',
        buttonText: this.getTranslate('tasks.calendar.month')
      }
    };

    this.buttonLabels = {
      today: this.getTranslate('tasks.calendar.today'),
      month: this.getTranslate('tasks.calendar.month'),
      week: this.getTranslate('tasks.calendar.week'),
      day: this.getTranslate('tasks.calendar.day'),
      list: this.getTranslate('tasks.calendar.list')
    };

    if (this.rtlDirection) {
      this.header = {
        left: 'timeGridWeek,timeGridDay',
        center: 'title',
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

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  eventRender(event:any){

    console.log(event);
    if (event.event.extendedProps.imageurl) {
      var tag = event.el.getElementsByClassName('fc-title');

      tag[0].insertAdjacentHTML("beforeBegin" ,
          "<img class='round-corner-all' src='" + event.event.extendedProps.imageurl +"' width='50px' height='50px'>");

    }
  }

  eventClick(event:any) {

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
      height: '100%',
      width: '100%',
      data: data
    });
  }
}
