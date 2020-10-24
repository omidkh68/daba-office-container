import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {HttpErrorResponse} from '@angular/common/http';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {ApiService} from '../logic/api.service';
import {TaskInterface} from '../logic/task-interface';
import {MessageService} from '../../message/service/message.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-task-incomplete-task',
  templateUrl: './task-incomplete-task.component.html',
  styleUrls: ['./task-incomplete-task.component.scss']
})
export class TaskIncompleteTaskComponent extends LoginDataClass implements OnInit, OnDestroy {

  rtlDirection: boolean;
  taskList: Array<TaskInterface>;
  private _subscription: Subscription = new Subscription();
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'IncompleteTasks'};

  constructor(private translate: TranslateService,
              private viewDirection: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService,
              private injector: Injector,
              private api: ApiService,
              private messageService: MessageService,
              private refreshLoginService: RefreshLoginService,
              private userInfoService: UserInfoService,
              public dialogRef: MatDialogRef<TaskIncompleteTaskComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.taskList = this.data
  }

  changeStatus(taskData) {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'IncompleteTasks'});

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.taskChangeStatus(taskData, 'inProgress').subscribe(async (resp: any) => {

        if (resp.result) {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'IncompleteTasks'});

          this.messageService.showMessage(resp.message);

          this.closeDialog();
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'IncompleteTasks'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getColor(percentage: number) {
    if (percentage < 10 && percentage >= 0) {
      return 'spinner-color-red';
    } else if (percentage <= 30 && percentage > 10) {
      return 'spinner-color-redorange';
    } else if (percentage <= 50 && percentage > 30) {
      return 'spinner-color-orange';
    } else if (percentage <= 80 && percentage > 50) {
      return 'spinner-color-lightgreen';
    } else if (percentage > 80) {
      return 'spinner-color-green';
    }
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
