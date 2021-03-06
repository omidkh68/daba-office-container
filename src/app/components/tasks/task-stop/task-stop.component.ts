import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserInfoService} from '../../users/services/user-info.service';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {ResultTaskStopInterface} from '../logic/board-interface';

@Component({
  selector: 'app-task-stop',
  templateUrl: './task-stop.component.html',
  styleUrls: ['./task-stop.component.scss']
})
export class TaskStopComponent extends LoginDataClass implements OnInit, OnDestroy {
  form: FormGroup;
  task: TaskInterface;
  rtlDirection = false;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: TaskInterface,
              public dialogRef: MatDialogRef<TaskStopComponent>,
              private fb: FormBuilder,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this.task = data;
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this.form.patchValue({
        taskId: this.task.taskId,
        percentage: this.task.percentage
      });
    });
  }

  createForm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        taskId: new FormControl(0),
        description: new FormControl('', Validators.required),
        percentage: new FormControl(0, Validators.required),
        email: new FormControl(this.loggedInUser.email, Validators.required)
      });

      resolve(true);
    });
  }

  submit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    this.form.disable();

    this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.apiService.taskStop(this.form.value).subscribe((resp: ResultTaskStopInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        if (resp.result === 1) {
          this.messageService.showMessage(resp.message);

          this.dialogRef.close(true);
        } else {
          this.form.enable();

          this.messageService.showMessage(resp.message);
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message);
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.form.enable();

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
