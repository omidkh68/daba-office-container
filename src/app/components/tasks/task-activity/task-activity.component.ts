import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivityInterface} from './logic/activity-interface';
import {ApiService} from './logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';

@Component({
  selector: 'app-task-activity',
  templateUrl: './task-activity.component.html',
  styleUrls: ['./task-activity.component.scss']
})
export class TaskActivityComponent implements AfterViewInit {
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

  constructor(private apiService: ApiService) {
  }

  ngAfterViewInit(): void {
    this.getActivities().then((activities: Array<ActivityInterface>) => {
      setTimeout(() => {
        this.activityList = activities;
      });

      this.single = [
        {
          "name": "تکمیل شده",
          "value": this.task.percentage
        },
        {
          "name": "تکمیل نشده",
          "value": (100 - this.task.percentage)
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
}
