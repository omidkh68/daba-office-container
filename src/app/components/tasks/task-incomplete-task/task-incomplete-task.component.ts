import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ResultTaskInterface} from '../logic/board-interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-task-incomplete-task',
  templateUrl: './task-incomplete-task.component.html',
  styleUrls: ['./task-incomplete-task.component.scss']
})
export class TaskIncompleteTaskComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection = false;
  taskList: Array<TaskInterface>;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'incompleteTasks'};

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Array<TaskInterface>,
              public dialogRef: MatDialogRef<TaskIncompleteTaskComponent>,
              private injector: Injector,
              private apiService: ApiService,
              private translate: TranslateService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngOnInit(): void {
    this.taskList = this.data;
  }

  changeStatus(taskData: TaskInterface): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'incompleteTasks'});

    this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.apiService.taskChangeStatus(taskData, 'inProgress').subscribe((resp: ResultTaskInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'incompleteTasks'});

        if (resp.result) {
          this.closeDialog();
        }

        if (resp.message) {
          this.messageService.showMessage(resp.message);
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message, 'error');
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'incompleteTasks'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getColor(percentage: number): string {
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

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
