import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {LoginInterface} from '../../login/logic/login.interface';
import {MessageService} from '../../message/service/message.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivityInterface} from './logic/activity-interface';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ResultTaskActivitiesInterface} from '../logic/board-interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-task-activity',
  templateUrl: './task-activity.component.html',
  styleUrls: ['./task-activity.component.scss']
})
export class TaskActivityComponent implements AfterViewInit, OnDestroy {
  @Input()
  task: TaskInterface;

  @Input()
  rtlDirection: boolean;

  @Input()
  loginData: LoginInterface;

  activityList: Array<ActivityInterface> = [];
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'project-activity'};
  single = [];
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme = {
    domain: ['#4caf50', '#b71c1c']
  };

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private translate: TranslateService,
              private messageService: MessageService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngAfterViewInit(): void {
    this.getActivities().then(() => {
      this.single = [
        {
          name: this.getTranslate('tasks.activity.completed'),
          value: this.task.percentage
        },
        {
          name: this.getTranslate('tasks.activity.not_completed'),
          value: (100 - this.task.percentage)
        }
      ];
    });
  }

  getActivities() {
    return new Promise((resolve) => {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project-activity'});

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.getActivities(this.task.taskId).subscribe((resp: ResultTaskActivitiesInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project-activity'});

          if (resp.result === 1) {
            this.activityList = resp.contents;

            resolve(true);
          }
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message);
          }

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project-activity'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    });
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
