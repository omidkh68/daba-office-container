import {AfterViewInit, Component, Inject, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {ApiService} from '../../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../../users/logic/user-interface';
import {LoginInterface} from '../../../login/logic/login.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDataClass} from '../../../../services/loginData.class';
import {MessageService} from '../../../message/service/message.service';
import {UserInfoService} from '../../../users/services/user-info.service';
import {HttpErrorResponse} from '@angular/common/http';
import {FilterTaskInterface} from '../../logic/filter-task-interface';
import {RefreshLoginService} from '../../../login/services/refresh-login.service';
import {TaskDurationInterface} from '../../logic/task-duration-interface';
import {LoadingIndicatorService} from '../../../../services/loading-indicator.service';
import {MatOptionSelectionChange} from '@angular/material/core/option/option';
import {IDatePickerDirectiveConfig} from 'ng2-jalali-date-picker';
import {ResultFilterCalendarDurationInterface} from '../../logic/filter-interface';

@Component({
  selector: 'app-task-calendar-filter',
  templateUrl: './task-calendar-filter.component.html'
})
export class TaskCalendarFilterComponent extends LoginDataClass implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  sumTime: any;

  @Input()
  calendarComponent: any;

  rtlDirection = false;
  loginData: LoginInterface;
  usersList: Array<UserInterface>;
  userSelected: UserInterface;
  form: FormGroup;
  datePicker: IDatePickerDirectiveConfig;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterTaskInterface,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private refreshLoginService: RefreshLoginService,
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

  ngAfterViewInit(): void {
    this.setupDatepickers();
  }

  setupDatepickers(): void {
    this.datePicker = {
      locale: this.rtlDirection ? 'fa' : 'en',
      firstDayOfWeek: this.rtlDirection ? 'sa' : 'mo',
      format: this.rtlDirection ? 'YYYY/MM/DD' : 'YYYY/MM/DD',
      closeOnSelect: true,
      closeOnSelectDelay: 150
    };
  }

  createForm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.form = new FormGroup({
        adminId: new FormControl(null, Validators.required),
        dateStart: new FormControl('', Validators.required),
        dateStop: new FormControl('', Validators.required),
        userImg: new FormControl('0'),
        email: new FormControl(this.loggedInUser.email)
      });

      resolve(true);
    });
  }

  updateImage(event: MatOptionSelectionChange, user: UserInterface): void {
    if (event.isUserInput) {
      this.userSelected = user;
    }
  }

  closeDialog(toggle: boolean): void {
    this.dialogRef.close(toggle);
  }

  submit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    const formValue: TaskDurationInterface = {...this.form.value};

    delete(formValue.email);
    delete(formValue.userImg);

    if (this.rtlDirection) {
      formValue.dateStart = jalaliMoment.from(formValue.dateStart, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');
      formValue.dateStop = jalaliMoment.from(formValue.dateStop, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');
    } else {
      formValue.dateStart = moment(formValue.dateStart, 'YYYY/MM/DD').format('YYYY-MM-DD');
      formValue.dateStop = moment(formValue.dateStop, 'YYYY/MM/DD').format('YYYY-MM-DD');
    }

    this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.form.disable();

    this._subscription.add(
      this.apiService.boardsCalendarDurationTask(formValue).subscribe((resp: ResultFilterCalendarDurationInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});
        try {
          if (resp.result === 1) {
            const calendarEvent = [];

            resp.content[0].map(time => {
              const taskEvent = {
                title: time.timediff,
                start: new Date(time.startDate),
                end: new Date(time.startDate)
              };

              calendarEvent.push(taskEvent);
            });

            this.sumTime = resp.content[1][0].timeSum;

            const parameter = {
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
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message, 'error');
        }

        this.form.enable();

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
