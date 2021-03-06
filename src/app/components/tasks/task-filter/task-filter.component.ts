import {AfterViewInit, Component, ElementRef, Inject, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {FilterInterface} from '../logic/filter-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import * as jalaliMoment from 'jalali-moment';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {FilterTaskInterface} from '../logic/filter-task-interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ResultFilterInterface} from '../logic/board-interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {IDatePickerDirectiveConfig} from 'ng2-jalali-date-picker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelect} from '@angular/material/select';

export interface filterType {
  index: number;
  typeName: string;
  textName: string;
}

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html'
})
export class TaskFilterComponent extends LoginDataClass implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('typeSelect') typeSelect: ElementRef<MatSelect>;

  rtlDirection = false;
  filterData: FilterInterface = {
    userId: 0,
    adminId: 0,
    dateStart: '',
    dateStop: '',
    projectId: 0,
    taskName: '',
    email: '0',
    userImg: '0',
    type: '',
    status: 0,
    percentageStatus: false
  };
  projectsList: Array<ProjectInterface> = [];
  usersList: Array<UserInterface> = [];
  form: FormGroup;
  filterTypes: Array<filterType> = [
    {
      index: 0,
      typeName: 'byCreateDate',
      textName: 'tasks.task_filter.by_create_date'
    },
    {
      index: 1,
      typeName: 'byProject',
      textName: 'tasks.task_filter.by_project'
    },
    {
      index: 2,
      typeName: 'byUser',
      textName: 'tasks.task_filter.by_user'
    },
    {
      index: 3,
      typeName: 'byStartDate',
      textName: 'tasks.task_filter.by_start_date'
    },
    {
      index: 4,
      typeName: 'byStopDate',
      textName: 'tasks.task_filter.by_stop_date'
    },
    {
      index: 5,
      typeName: 'byUserStartDate',
      textName: 'tasks.task_filter.by_user_start_date'
    },
    {
      index: 6,
      typeName: 'byUserStopDate',
      textName: 'tasks.task_filter.by_user_stop_date'
    },
    {
      index: 7,
      typeName: 'byStartedTask',
      textName: 'tasks.task_filter.by_started_task'
    },
    {
      index: 8,
      typeName: 'byPostponed',
      textName: 'tasks.task_filter.by_postponed'
    }
  ];
  datePicker: IDatePickerDirectiveConfig = null;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'taskFilter'};

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterTaskInterface,
              public dialogRef: MatDialogRef<TaskFilterComponent>,
              private api: ApiService,
              private fb: FormBuilder,
              private injector: Injector,
              private translate: TranslateService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;

        if (this.form) {
          this.setupDatepickers();
        }
      })
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this.usersList = [...this.data.usersList];
    this.projectsList = [...this.data.projectsList];
    this.filterData = {...this.data.filterData};
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this.form.patchValue({
        taskName: this.filterData.taskName ? this.filterData.taskName : '',
        projectId: this.filterData.projectId ? this.filterData.projectId : 0,
        dateStart: this.filterData.dateStart ? this.filterData.dateStart : '',
        dateStop: this.filterData.dateStop ? this.filterData.dateStop : '',
        adminId: this.filterData.adminId ? this.filterData.adminId : 0,
        email: this.filterData.email ? this.filterData.email : this.loggedInUser.email,
        userImg: this.filterData.userImg ? this.filterData.userImg : '0',
        type: this.filterData.type ? this.filterData.type : null,
        status: this.filterData.status ? this.filterData.status : 0,
        percentageStatus: this.filterData.percentageStatus ? this.filterData.percentageStatus : false
      });

      this.form.markAllAsTouched();

      setTimeout(() => this.checkFormValidation(), 1000);

      this._subscription.add(
        this.form.get('adminId').valueChanges.subscribe(selectedValue => {
          const user = this.usersList.filter(user => user.adminId === selectedValue).pop();

          if (user) {
            this.form.get('userImg').setValue(user.email);
          }
        })
      );
    });

    setTimeout(() => {
      const userIdExistIndex = this.usersList.findIndex(user => user.adminId === 0);

      if (userIdExistIndex === -1) {
        this.usersList.splice(0, 0, {
          adminId: 0,
          name: this.getTranslate('tasks.task_filter.all'),
          family: '',
          email: '0'
        });
      }

      const projectIdExistIndex = this.projectsList.findIndex(project => project.projectId === 0);

      if (projectIdExistIndex === -1) {
        this.projectsList.splice(0, 0, {
          projectId: 0,
          projectName: this.getTranslate('tasks.task_filter.all')
        });
      }
    }, 500);
  }

  ngAfterViewInit(): void {
    this.setupDatepickers();

    this.typeSelect.nativeElement.focus();
  }

  setupDatepickers(): void {
    this.datePicker = {
      locale: this.rtlDirection ? 'fa' : 'en',
      firstDayOfWeek: this.rtlDirection ? 'sa' : 'mo',
      format: 'YYYY/MM/DD',
      closeOnSelect: true,
      closeOnSelectDelay: 150
    };
  }

  createForm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        userId: new FormControl(0, Validators.required),
        userImg: new FormControl('0'),
        email: new FormControl(this.loggedInUser.email),
        taskName: new FormControl(''),
        projectId: new FormControl(0),
        dateStart: new FormControl(''),
        dateStop: new FormControl(''),
        type: new FormControl('byCreateDate', Validators.required),
        adminId: new FormControl(0),
        page: new FormControl('-1'),
        status: new FormControl(0),
        percentageStatus: new FormControl(false),
      });

      resolve(true);
    });
  }

  checkFormValidation(): void {
    if (this.form.get('type').value !== 'byProject' && this.form.get('type').value !== 'byUser') {
      this.dateRequiredValidation();
    }

    this._subscription.add(
      this.form.valueChanges.subscribe((selectedValue: FilterInterface) => {
        const projectIdControl = this.form.get('projectId');
        const adminIdControl = this.form.get('adminId');

        switch (selectedValue.type) {
          case 'byProject':
            this.resetFormValidation();

            if (projectIdControl.value === 0) {
              projectIdControl.setErrors({'incorrect': true});
              projectIdControl.markAsTouched();
            }

            break;

          case 'byCreateDate':
            this.dateRequiredValidation();
            break;

          case 'byStartDate':
            this.dateRequiredValidation();
            break;

          case 'byStopDate':
            this.dateRequiredValidation();
            break;

          case 'byUserStartDate':
            this.dateRequiredValidation();
            break;

          case 'byUserStopDate':
            this.dateRequiredValidation();
            break;

          case 'byUser':
            this.resetFormValidation();

            if (adminIdControl.value === 0) {
              adminIdControl.setErrors({'incorrect': true});
              adminIdControl.markAsTouched();
            }

            break;

          default:
            this.resetFormValidation();
            break;
        }
      })
    );
  }

  dateRequiredValidation(): void {
    const dateStartControl = this.form.get('dateStart');
    const dateStopControl = this.form.get('dateStop');

    this.resetFormValidation();

    if (dateStartControl.value === '' && dateStopControl.value !== '') {
      dateStartControl.setErrors({'incorrect': true});
      dateStopControl.setErrors({'incorrect': true});
      dateStartControl.markAsTouched();
      dateStopControl.markAsTouched();
    } else if (dateStartControl.value !== '' && dateStopControl.value === '') {
      dateStartControl.setErrors({'incorrect': true});
      dateStopControl.setErrors({'incorrect': true});
      dateStartControl.markAsTouched();
      dateStopControl.markAsTouched();
    } else if (dateStartControl.value === '' || dateStopControl.value === '') {
      dateStartControl.setErrors({'incorrect': true});
      dateStopControl.setErrors({'incorrect': true});
      dateStartControl.markAsTouched();
      dateStopControl.markAsTouched();
    }
  }

  resetFormValidation(): void {
    this.form.get('projectId').setErrors(null);
    this.form.get('dateStart').setErrors(null);
    this.form.get('dateStop').setErrors(null);
    this.form.get('adminId').setErrors(null);
  }

  submit(): void {
    this.dialogRef.disableClose = true;
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'taskFilter'});

    const formValue: FilterInterface = {...this.form.value};

    if (this.rtlDirection) {
      if (jalaliMoment(formValue.dateStart).format('YYYY/MM/DD') !== 'Invalid date') {
        formValue.dateStart = jalaliMoment.from(formValue.dateStart, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');
      }

      if (jalaliMoment(formValue.dateStop).format('YYYY/MM/DD') !== 'Invalid date') {
        formValue.dateStop = jalaliMoment.from(formValue.dateStop, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');
      }
    }

    this.filterData = {...this.form.value};

    if (formValue.adminId === 0) {
      delete (formValue.adminId);
    }

    if (formValue.projectId === 0) {
      delete (formValue.projectId);
    }

    if (formValue.taskName === '') {
      delete (formValue.taskName);
    }

    if (formValue.dateStart === '') {
      delete (formValue.dateStart);
    }

    if (formValue.dateStop === '') {
      delete (formValue.dateStop);
    }

    if (formValue.percentageStatus === false) {
      delete (formValue.percentageStatus);
    }

    if (formValue.status === 0) {
      delete (formValue.status);
    }

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.form.disable();

    this._subscription.add(
      this.api.filterTask(formValue).subscribe((resp: ResultFilterInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'taskFilter'});

        if (resp.result === 1) {
          this.dialogRef.close(
            {
              result: 1,
              filterData: this.filterData,
              contents: resp.contents
            }
          );
        } else {
          this.dialogRef.disableClose = false;
        }

        this.form.enable();

        if (resp.message) {
          this.messageService.showMessage(resp.message);
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message, 'error');

          this.form.enable();

          this.dialogRef.disableClose = false;
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'taskFilter'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
