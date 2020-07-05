import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Calendar} from '@fullcalendar/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {ApiService} from '../../logic/api.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginInterface} from '../../../login/logic/login.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../../login/services/refresh-login.service';
import {TaskDurationInterface} from '../../logic/task-duration-interface';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {LoadingIndicatorService} from '../../../../services/loading-indicator.service';

@Component({
  selector: 'app-task-calendar-rate',
  templateUrl: './task-calendar-rate.component.html',
  styleUrls: ['./task-calendar-rate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarRateComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  @Input()
  usersList: any;

  @Input()
  loginData: LoginInterface;

  sumTime: string = '';
  calendarDifferentEvents: any;
  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  form: FormGroup;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this._subscription.add(
        this.form.get('adminId').valueChanges.subscribe(selectedValue => {
          const user = this.usersList.filter(user => user.adminId === selectedValue).pop();

          if (user) {
            this.form.get('userImg').setValue(user.email);
          }
        })
      );
    })
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = new FormGroup({
        adminId: new FormControl(0),
        userImg: new FormControl('0'),
        dateStart: new FormControl(''),
        dateStop: new FormControl('')
      });

      resolve(true);
    });
  }

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }

  submit() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    const formValue: TaskDurationInterface = Object.assign({}, this.form.value);

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.boardsCalendarDurationTask(formValue).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        if (resp.result === 1) {
          let calendarEvent = [];

          resp.content[0].map(time => {
            const taskEvent = {
              title: time.timediff,
              start: new Date(time.startDate),
              end: new Date(time.startDate)
            };

            calendarEvent.push(taskEvent);
          });

          this.sumTime = resp.content[1][0].timeSum;

          this.calendarDifferentEvents = calendarEvent;

          let calendarApi = this.calendarComponent.getApi();

          if (formValue.dateStart)
            calendarApi.gotoDate(formValue.dateStart); // call a method on the Calendar object
        } else {
          this.form.enable();
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
