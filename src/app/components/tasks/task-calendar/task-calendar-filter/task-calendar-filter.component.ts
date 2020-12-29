import {Component, Inject, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../../users/logic/user-interface';
import {LoginInterface} from '../../../login/logic/login.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDataClass} from '../../../../services/loginData.class';
import {UserInfoService} from '../../../users/services/user-info.service';
import {TaskDurationInterface} from '../../logic/task-duration-interface';
import {LoadingIndicatorService} from '../../../../services/loading-indicator.service';
import * as moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-task-calendar-filter',
  templateUrl: './task-calendar-filter.component.html'
})
export class TaskCalendarFilterComponent extends LoginDataClass implements OnInit, OnDestroy {
  @Input()
  sumTime: any;

  @Input()
  calendarComponent: any;

  rtlDirection: boolean;
  loginData: LoginInterface;
  usersList: UserInterface[];
  userSelected: UserInterface;
  form: FormGroup;
  calendarDifferentEvents: any;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private api: ApiService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private loadingIndicatorService: LoadingIndicatorService,
              private dialogRef: MatDialogRef<TaskCalendarFilterComponent>) {
    super(injector, userInfoService);

    this.usersList = this.data.usersList;
    this.loginData = this.data.loginData;
    this.rtlDirection = this.data.rtlDirection;
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
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = new FormGroup({
        adminId: new FormControl(null, Validators.required),
        dateStart: new FormControl('', Validators.required),
        dateStop: new FormControl('', Validators.required),
        userImg: new FormControl('0'),
        email: new FormControl(this.loggedInUser.email)
      });

      resolve();
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

    this.form.disable();

    this._subscription.add(
      this.api.boardsCalendarDurationTask(formValue).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});
        try {
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

            let parameter = {
              sumTime: this.sumTime,
              calendarEvent: calendarEvent,
              dateStart: formValue.dateStart,
              userSelected: this.userSelected,
              filterData: formValue
            };
            this.dialogRef.close(parameter);
          } else {
            this.form.enable();
          }
        } catch (e) {
          console.log(e);
        }
      }, () => {
        this.form.enable();

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
