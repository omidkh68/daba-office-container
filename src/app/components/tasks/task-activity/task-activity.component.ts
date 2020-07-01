import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {LoginInterface} from '../../users/logic/login.interface';
import {TranslateService} from '@ngx-translate/core';
import {ActivityInterface} from './logic/activity-interface';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {ApiService} from '../logic/api.service';

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
              private loadingIndicatorService: LoadingIndicatorService,
              private translate: TranslateService) {
  }

  ngAfterViewInit(): void {
    this.getActivities().then((activities: Array<ActivityInterface>) => {
      setTimeout(() => {
        this.activityList = activities;
      });

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
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.getActivities(this.task.taskId).subscribe((resp: any) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          if (resp.result === 1) {
            resolve(resp.contents);
          }
        }, error => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});
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
