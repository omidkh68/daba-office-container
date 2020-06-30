import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
// import {UserInterface} from '../users/logic/user-interface';
import {MessageService} from '../../services/message.service';
import {WindowInterface} from './logic/window.interface';
import {UserInfoService} from '../users/services/user-info.service';
import {ElectronService} from '../../services/electron.service';
import {WindowManagerService} from '../../services/window-manager.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ServiceItemsInterface} from './logic/service-items.interface';
import {UserContainerInterface} from '../users/logic/user-container.interface';
import {ServiceInterface} from '../services/logic/service-interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowManager: Array<WindowInterface>;
  loggedInUser: UserContainerInterface;
  serviceList: ServiceItemsInterface[] = [];/*
    {
      serviceId: 1,
      serviceNameFa: 'سیستم مدیریت تسک',
      serviceNameEn: 'Task Management System',
      serviceTitle: 'service-task',
      icon: 'playlist_add_check',
      status: 1,
      width: 1200,
      height: 700
    },
    {
      serviceId: 2,
      serviceNameFa: 'سیستم تلفنی',
      serviceNameEn: 'PBX System',
      serviceTitle: 'service-pbx',
      icon: 'perm_phone_msg',
      status: 1,
      width: 350,
      height: 500
    },
    {
      serviceId: 3,
      serviceNameFa: 'سیستم کنفرانس ویدیویی',
      serviceNameEn: 'Video Conference System',
      serviceTitle: 'service-video-conference',
      icon: 'picture_in_picture',
      status: 1,
      width: 1200,
      height: 700
    }
  ]*/

  private _subscription: Subscription = new Subscription();

  constructor(private electronService: ElectronService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
              public dialog: MatDialog,
              private messageService: MessageService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => {
        this.loggedInUser = user;

        this.loggedInUser.list_permission.map((item: ServiceInterface) => {
          let icon: string = '';
          let width = 0;
          let height = 0;
          let serviceTitle = item.name.split(' ').join('_').toLowerCase();

          switch (serviceTitle) {
            case 'project_microservice':
              icon = 'playlist_add_check';
              width = 1200;
              height = 700;

              break;

            case 'pbx_microservice':
              icon = 'perm_phone_msg';
              width = 350;
              height = 500;

              break;

            case 'video_conference':
              icon = 'picture_in_picture';
              width = 1200;
              height = 700;

              break;
          }

          const service: ServiceItemsInterface = {
            ...item,
            serviceTitle: serviceTitle,
            icon: icon,
            width: width,
            height: height
          };

          if (serviceTitle !== 'hr_microservice') {
            this.serviceList.push(service);
          }
        });
      })
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
      this.messageService.showMessage(`${this.loggedInUser.name} خوش آمدید `);
    }, 2000);
  }

  changeDarkMode() {
    // this.userInfoService.changeDarkMode(this.loggedInUser);
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
