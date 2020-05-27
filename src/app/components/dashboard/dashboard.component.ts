import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from '../../core/services';
import {ServiceItemsInterface} from './logic/service-items.interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatDialog} from '@angular/material/dialog';
import {systemPreferences} from 'electron';
import {UserInterface} from '../users/logic/user-interface';
import {UserInfoService} from '../../services/user-info.service';
import {MessageService} from '../../services/message.service';
import {WindowManagerService} from '../../services/window-manager.service';
import {WindowInterface} from './logic/window.interface';
import {ViewDirectionService} from '../../services/view-direction.service';

export interface INotification {
  onclick: () => void;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowManager: Array<WindowInterface>;
  loggedInUser: UserInterface;
  serviceList: ServiceItemsInterface[] = [
    {
      serviceId: 1,
      serviceNameFa: 'سیستم مدیریت تسک',
      serviceNameEn: 'Task Management System',
      serviceTitle: 'service-task',
      icon: 'playlist_add_check',
      status: 1
    },
    {
      serviceId: 2,
      serviceNameFa: 'سیستم تلفنی',
      serviceNameEn: 'PBX System',
      serviceTitle: 'service-pbx',
      icon: 'perm_phone_msg',
      status: 1
    },
    {
      serviceId: 3,
      serviceNameFa: 'سیستم کنفرانس ویدیویی',
      serviceNameEn: 'Video Conference System',
      serviceTitle: 'service-video-conference',
      icon: 'picture_in_picture',
      status: 0
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private electronService: ElectronService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
              public dialog: MatDialog,
              private messageService: MessageService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.windowManagerService.windowsList.subscribe(windowList => this.windowManager = windowList)
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.messageService.durationInSeconds = 10;
      this.messageService.showMessage(`${this.loggedInUser.name} ${this.loggedInUser.family} خوش آمدید `);
    }, 2000);

    /*const notification: INotification = <INotification>(new Notification('Omid', {
      body: 'salam sosis',
      icon: 'icon'
    }));

    notification.onclick = () => {
      console.log('from notification');
    };*/

    /*this.notification = new Notification('test message', {
      body: 'omdioasd'
    });

    this.notification.onclick = () => {
      console.log('omodidimasoidoaisjoa');
    };*/

    /*this.electronService.systemPreferences.askForMediaAccess('microphone').then(result => {
      console.log(result);
    });

    console.log(this.electronService.systemPreferences.getMediaAccessStatus('microphone'));*/

  }

  changeDarkMode() {
    this.userInfoService.changeDarkMode(this.loggedInUser);
  }

  changeDirection() {
    const rtlDirection: boolean = !this.rtlDirection;
    this.viewDirection.changeDirection(rtlDirection);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
