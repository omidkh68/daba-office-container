import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as jalaliMoment from 'jalali-moment';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TaskDataInterface} from '../logic/task-data-interface';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  templateUrl: './task-add.component.html'
})
export class TaskAddComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection: boolean = false;
  editable: boolean = false;
  form: FormGroup;
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: TaskDataInterface,
              public dialogRef: MatDialogRef<TaskAddComponent>,
              private api: ApiService,
              private fb: FormBuilder,
              private injector: Injector,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this.editable = true;

      this.form.enable();

      this._subscription.add(
        this.form.get('assignTo').valueChanges.subscribe(selectedValue => {
          const user = this.usersList.filter(user => user.adminId === selectedValue.adminId).pop();

          if (user) {
            this.form.get('email').setValue(user.email);
          }
        })
      );
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        taskId: new FormControl(0),
        taskName: new FormControl('', Validators.required),
        percentage: new FormControl(0, Validators.required),
        assignTo: new FormControl('', Validators.required),
        taskDurationHours: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+')]),
        taskDurationMinutes: new FormControl(0, Validators.required),
        startAt: new FormControl('', Validators.required),
        stopAt: new FormControl('', Validators.required),
        startTime: new FormControl('', Validators.required),
        stopTime: new FormControl('', Validators.required),
        project: new FormControl({}, Validators.required),
        taskDesc: new FormControl(''),
        email: new FormControl('0'),
        boardStatus: new FormControl('', Validators.required),
        taskDateStart: '0000-00-00 00:00:00',
        taskDateStop: '0000-00-00 00:00:00',
        assigner: new FormControl(this.loggedInUser.email, Validators.required),
        trackable: new FormControl(0)
      });

      resolve();
    });
  }

  updateForm(event: FormGroup) {
    this.form = event;

    setTimeout(() => {
      this.submit();
    }, 500);
  }

  cancelBtn(event) {
    if (event) {
      this.dialogRef.close(false);
    }
  }

  submit() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    const formInstance = {...this.form.value};

    this.form.disable();

    let taskStartDate = '';
    let taskStopDate = '';

    if (this.rtlDirection) {
      taskStartDate = jalaliMoment.from(formInstance.startAt, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');
      taskStopDate = jalaliMoment.from(formInstance.stopAt, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');

    } else {
      taskStartDate = formInstance.startAt;
      taskStopDate = formInstance.stopAt;
    }

    const formValue = {
      ...formInstance,
      startAt: taskStartDate + ' ' + formInstance.startTime + ':00',
      stopAt: taskStopDate + ' ' + formInstance.stopTime + ':00'
    };

    delete (formValue.taskId);

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.createTask(formValue).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        if (resp.result === 1) {
          this.messageService.showMessage(resp.message);

          this.dialogRef.close(true);
        } else {
          this.form.enable();
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.refreshLoginService.openLoginDialog(error);

        this.form.enable();
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
