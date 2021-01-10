import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {FormGroup} from '@angular/forms';
import {ApiService} from '../../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UtilsService} from '../../../../services/utils.service';
import {UserInterface} from '../../../users/logic/user-interface';
import {LoginInterface} from '../../../login/logic/login.interface';
import {TranslateService} from '@ngx-translate/core';
import {TaskCalendarRateInterface, TaskCalendarService} from '../services/task-calendar.service';
import {ViewDirectionService} from '../../../../services/view-direction.service';
import {EventHandlerService} from "../../../events/service/event-handler.service";

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

  calendarEvents: any;
  sumTime: any;
  userSelected: UserInterface;
  rtlDirection: boolean;
  form: FormGroup;
  datePickerConfig: any = null;

  private isVisible: boolean = false;
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
        this.eventHandlerService.currentCalendarRate.subscribe((resp:TaskCalendarRateInterface) => {
          if(resp){
            this.calendarEvents = resp.calendarEvent;
            this.sumTime = resp.sumTime;
            this.userSelected = resp.userSelected;
            setTimeout(() => {
              this.drawer.open();
              let goToDate =
                  this.rtlDirection ? jalaliMoment(new Date(resp.filterData.dateStart)) :
                      moment(new Date(resp.filterData.dateStart));
              this.datePickerDirective.api.moveCalendarTo(goToDate);
              document.querySelector('.rate-calendar .custom-full-calendar').classList.add('margin-r-full');
              this.datePickerConfig.locale = this.rtlDirection ? 'fa' : 'en';
              this.isVisible = true;
            },1000)
          }
        })
    );
  }

  ngAfterViewInit(): void {
    this.setupCalendar();
  }

  dayBtnCssClassCallback(event) {
    if(this.calendarEvents){
      setTimeout(() => {
        let date =
            this.rtlDirection ?
                event.locale('fa').format('YYYY/M/D') :
                event.locale('en').format('DD-MM-YYYY');

        let element: HTMLElement = document.querySelector('.rate-calendar .dp-calendar-day[data-date="' + date + '"]');
        if (element) {
          this.calendarEvents.map(item => {
            if (item.start.toLocaleDateString() == event._d.toLocaleDateString()) {
              element.insertAdjacentHTML('beforeend', "<div class='custom-event-box'>" + item.title + "</div>");
            }
          })
        }
      })
    }
  }

  setupCalendar() {
    this.datePickerConfig = {
      locale: this.rtlDirection ? 'fa' : 'en',
      firstDayOfWeek: this.rtlDirection ? 'sa' : 'mo',
      dayBtnCssClassCallback: (event) => {
        this.dayBtnCssClassCallback(event)
      }
    };
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
