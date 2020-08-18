import {
  AfterViewInit,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ApiService} from '../../logic/api.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import {Subscription} from 'rxjs/internal/Subscription';
import {UtilsService} from '../../../../services/utils.service';
import timeGridPlugin from '@fullcalendar/timegrid';
import {UserInterface} from '../../../users/logic/user-interface';
import {LoginInterface} from '../../../login/logic/login.interface';
import {TranslateService} from '@ngx-translate/core';
import {FullCalendarComponent} from '@fullcalendar/angular';

@Component({
  selector: 'app-task-calendar-rate',
  templateUrl: './task-calendar-rate.component.html',
  styleUrls: ['./task-calendar-rate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarRateComponent implements AfterViewInit, OnChanges, OnDestroy, DoCheck {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
  @ViewChild('drawer') drawer: any; // the #calendar in the template

  @Input()
  usersList: any;

  @Input()
  loginData: LoginInterface;

  @Input()
  calendarDifferentEvents: any;

  @Input()
  sumTime: any;

  @Input()
  dateStart: any;

  @Input()
  userSelected: UserInterface;

  @Input()
  rtlDirection: boolean;

  containerHeight = 300;
  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  form: FormGroup;
  buttonLabels = {};
  header = {};
  slotLabelFormat = [{
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }];
  views = {};

  private isVisible: boolean = false;
  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private utilService: UtilsService,
              private translateService: TranslateService) {
  }

  ngAfterViewInit(): void {
    this.containerHeight = document.getElementById('rate-container').offsetHeight;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.calendarComponent) {
      let calendarApi = this.calendarComponent.getApi();

      if (this.dateStart) {
        let month = this.dateStart._d.getMonth() + 1;

        month = this.utilService.pad(month, 2, null);

        calendarApi.gotoDate(this.dateStart._d.getFullYear() + '-' + month + '-' + this.dateStart._d.getDate());

        this.drawer.open();

        document.getElementById('full_calendar').classList.add('margin-r-full');
      }

      this.isVisible = true;
    }
  }

  ngDoCheck(): void {
    this.containerHeight = document.getElementById('rate-container').offsetHeight;
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
