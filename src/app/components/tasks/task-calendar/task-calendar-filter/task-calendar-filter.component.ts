import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../../users/logic/user-interface';
import {LoginInterface} from '../../../login/logic/login.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TaskDurationInterface} from '../../logic/task-duration-interface';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {LoadingIndicatorService} from '../../../../services/loading-indicator.service';

@Component({
  selector: 'app-task-calendar-filter',
  templateUrl: './task-calendar-filter.component.html'
})
export class TaskCalendarFilterComponent implements OnInit, OnDestroy {
  @Input()
  sumTime: any;

  @Input()
  calendarComponent: any;

  rtlDirection: boolean;
  loginData: LoginInterface;
  usersList: UserInterface[];
  userSelected: UserInterface;
  userSelectedCheck: boolean;
  form: FormGroup;
  calendarDifferentEvents: any;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private api: ApiService,
              private loadingIndicatorService: LoadingIndicatorService,
              private dialogRef: MatDialogRef<TaskCalendarFilterComponent>) {
    this.usersList = this.data.usersList;
    this.loginData = this.data.loginData;
    this.rtlDirection = this.data.rtlDirection;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      adminId: new FormControl(null, Validators.required),
      dateStart: new FormControl('', Validators.required),
      dateStop: new FormControl('', Validators.required),
      userImg: new FormControl('0')
    });
  }

  updateImage(event: any, user: any) {
    if (event.isUserInput) {
      this.userSelected = user;
    }
  }

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }

  closeDialog(toggle) {
    this.dialogRef.close(toggle);
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
          let sum = 0;

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

          let parameter = {
            sumTime: this.sumTime,
            calendarEvent: calendarEvent,
            dateStart: formValue.dateStart,
            userSelected: this.userSelected
          };
          this.dialogRef.close(parameter);
        } else {
          this.form.enable();
        }
      }, error => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
