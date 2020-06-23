import {Component, OnDestroy} from '@angular/core';
import {timer} from 'rxjs';
import * as moment from 'moment';
import * as lodash from 'lodash';
import {ApiService} from './logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../users/logic/user-interface';
import {TaskInterface} from '../tasks/logic/task-interface';
import {UserInfoService} from '../users/services/user-info.service';
import {ElectronService} from '../../services/electron.service';
import {CurrentTaskService} from '../tasks/services/current-task.service';
import {UserStatusInterface} from '../users/logic/user-status-interface';
import {ScreenshotInterface} from './logic/screenshot-interface';
import {ChangeStatusService} from '../status/services/change-status.service';

export interface AvailableHoursInterface {
  time: string;
  status: boolean;
}

@Component({
  selector: 'app-screenshot',
  template: ``
})
export class ScreenshotComponent implements OnDestroy {
  timerDueTime: number = 30000;
  timerPeriod: number = 30000;
  loggedInUser: UserInterface;
  userCurrentStatus: UserStatusInterface | string = '';
  currentTasks: Array<TaskInterface> | null = null;
  availableHours: Array<AvailableHoursInterface> = [
    // {time: '00', status: false}, {time: '01', status: false}, {time: '02', status: false}, {time: '03', status: false},
    // {time: '04', status: false}, {time: '05', status: false}, {time: '06', status: false}, {time: '07', status: false},
    {time: '08', status: false}, {time: '09', status: false}, {time: '10', status: false}, {time: '11', status: false},
    {time: '12', status: false}, {time: '13', status: false}, {time: '14', status: false}, {time: '15', status: false},
    {time: '16', status: false}, {time: '17', status: false}, {time: '18', status: false}, {time: '19', status: false},
    // {time: '20', status: false}, {time: '21', status: false}, {time: '22', status: false}, {time: '23', status: false}
  ];
  randomHours: Array<AvailableHoursInterface> = [];
  globalTimer = null;
  globalTimerSubscription: Subscription;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private electron: ElectronService,
              private changeStatusService: ChangeStatusService,
              private currentTaskService: CurrentTaskService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    this._subscription.add(
      this.changeStatusService.currentUserStatus.subscribe(status => {
        this.userCurrentStatus = status;

        if (this.userCurrentStatus !== '') {
          if (this.globalTimer !== null) {
            try {
              this.globalTimerSubscription.unsubscribe();
              this.globalTimer = null;
            } catch (e) {
              console.log(e);
            }
          }
        } else {
          if (this.globalTimer === null) {
            this.runTimerForScreenshot();
          }
        }
      })
    );

    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );
  }

  runTimerForScreenshot() {
    this.globalTimer = timer(
      this.timerDueTime, this.timerPeriod
    );

    this.randomHours = lodash.sampleSize(this.availableHours, 5);

    this.globalTimerSubscription = this.globalTimer.subscribe(
      t => {
        this.api.getTickTok().subscribe((resp: any) => {
          const serverDate = resp.time;
          const localDate = new Date();

          const serverDateTmp = moment(serverDate).format('YYYY-MM-DD HH');
          const localDateTmp = moment(localDate).format('YYYY-MM-DD HH');

          const checkTime = moment(serverDate).format('HH');

          const findTime: AvailableHoursInterface = lodash.find(this.randomHours, item => item.time === checkTime);

          if (findTime && findTime.status === false) {
            findTime.status = true;

            this.takeAScreenShot();
          }

          if (serverDateTmp !== localDateTmp) {
            alert('Different server and local time');
          }
        });
      }
    );
  }

  takeAScreenShot() {
    let options = {
      types: ['screen'],
      thumbnailSize: {width: 800, height: 600},
      fetchWindowIcons: true
    };

    this.electron.desktopCapturer.getSources(options).then(async sources => {
      let screenshots: Array<string> = [];

      await sources.map(source => {
        const screenshotData: string = source.thumbnail.toDataURL({scaleFactor: 1});

        screenshots.push(screenshotData);
      });

      const data: ScreenshotInterface = {
        userId: this.loggedInUser,
        files: screenshots
      };

      this._subscription.add(
        this.api.createScreenshot(data).subscribe((resp: any) => {
          // console.log(resp);
        })
      );

    }).catch((err) => {
      throw err.message;
    });
  }

  determineScreenShot() {
    const screenSize = this.electron.screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);

    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    };
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
