import {AfterViewInit, Component, Input, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {FormGroup} from '@angular/forms';
import {ApiService} from '../../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UtilsService} from '../../../../services/utils.service';
import {UserInterface} from '../../../users/logic/user-interface';
import {LoginInterface} from '../../../login/logic/login.interface';
import {TranslateService} from '@ngx-translate/core';
import {EventHandlerService} from '../../../events/service/event-handler.service';
import {ViewDirectionService} from '../../../../services/view-direction.service';
import {CalendarItemInterface, TaskCalendarRateInterface, TaskCalendarService} from '../services/task-calendar.service';

@Component({
  selector: 'app-task-calendar-rate',
  templateUrl: './task-calendar-rate.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarRateComponent implements AfterViewInit, OnDestroy {
  @ViewChild('drawer') drawer: any; // the #calendar in the template
  @ViewChild('dateCalendar') datePickerDirective: any;

  @Input()
  usersList: any;

  @Input()
  loginData: LoginInterface;

  calendarEvents: CalendarItemInterface[];
  sumTime: any;
  userSelected: UserInterface;
  rtlDirection = false;
  form: FormGroup;
  datePickerConfig: any = null;

  private isVisible = false;
  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private utilService: UtilsService,
              private translateService: TranslateService,
              private eventHandlerService: EventHandlerService,
              private taskCalendarService: TaskCalendarService,
              private viewDirectionService: ViewDirectionService) {
    this._subscription.add(
      this.viewDirectionService.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.eventHandlerService.currentCalendarRate.subscribe((resp: TaskCalendarRateInterface) => {
        if (resp) {
          this.calendarEvents = resp.calendarEvent;
          this.sumTime = resp.sumTime;
          this.userSelected = resp.userSelected;

          setTimeout(() => {
            const goToDate = this.rtlDirection ? jalaliMoment(new Date(resp.filterData.dateStart)) : moment(new Date(resp.filterData.dateStart));

            this.drawer.open();

            this.datePickerDirective.api.moveCalendarTo(goToDate);

            document.querySelector('.rate-calendar .custom-full-calendar').classList.add('margin-r-full');

            this.datePickerConfig.locale = this.rtlDirection ? 'fa' : 'en';

            this.isVisible = true;
          }, 1000);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.setupCalendar();
  }

  dayBtnCssClassCallback(event: any): void {
    if(this.calendarEvents){
      setTimeout(() => {
        const date: string = this.rtlDirection ? event.locale('fa').format('YYYY/M/D') : event.locale('en').format('DD-MM-YYYY');

        const element: HTMLElement = document.querySelector(`.rate-calendar .dp-calendar-day[data-date="${date}"]`);
        if (element) {
          this.calendarEvents.map((item: CalendarItemInterface) => {
            if (item.start.toLocaleDateString() == event._d.toLocaleDateString()) {
              element.insertAdjacentHTML('beforeend', `<div class='custom-event-box'>${item.title}</div>`);
            }
          });
        }
      });
    }
  }

  setupCalendar(): void {
    this.datePickerConfig = {
      locale: this.rtlDirection ? 'fa' : 'en',
      firstDayOfWeek: this.rtlDirection ? 'sa' : 'mo',
      dayBtnCssClassCallback: (event) => {
        this.dayBtnCssClassCallback(event);
      }
    };
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
