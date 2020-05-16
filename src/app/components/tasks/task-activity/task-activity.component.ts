import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivityInterface} from './logic/activity-interface';
import {ApiService} from './logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-task-activity',
  templateUrl: './task-activity.component.html',
  styleUrls: ['./task-activity.component.scss']
})
export class TaskActivityComponent implements AfterViewInit {
  @Input()
  taskId: number = 0;

  activityList: Array<ActivityInterface> = [];

  single = [
    {
      "name": "تکمیل شده",
      "value": 80
    },
    {
      "name": "تکمیل نشده",
      "value": 20
    }
  ];

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
      this.activityList = activities;
    });
  }

  getActivities() {
    return new Promise((resolve) => {
      this._subscription.add(
        this.apiService.getActivities(this.taskId).subscribe((resp: any) => {
          if (resp.result === 1) {
            resolve(resp.contents);
          }
        })
      );
    });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
