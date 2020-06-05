import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {ActivityInterface} from './logic/activity-interface';
import {ApiService} from './logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-task-activity',
  templateUrl: './task-activity.component.html',
  styleUrls: ['./task-activity.component.scss']
})
export class TaskActivityComponent implements AfterViewInit, OnDestroy {
  @Input()
  task: TaskInterface;

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

  constructor(private apiService: ApiService,
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
      this._subscription.add(
        this.apiService.getActivities(this.task.taskId).subscribe((resp: any) => {
          if (resp.result === 1) {
            resolve(resp.contents);
          }
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
