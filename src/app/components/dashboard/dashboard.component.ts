import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../services/message.service';
import {LoginDataClass} from '../../services/loginData.class';
import {WindowInterface} from './logic/window.interface';
import {UserInfoService} from '../users/services/user-info.service';
import {ElectronService} from '../../services/electron.service';
import {SoftPhoneService} from '../soft-phone/service/soft-phone.service';
import {ServiceInterface} from '../services/logic/service-interface';
import {WindowManagerService} from '../../services/window-manager.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ServiceItemsInterface} from './logic/service-items.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowManager: Array<WindowInterface>;
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
              private injector: Injector,
              public dialog: MatDialog,
              private api: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => {
        this.loggedInUser = user;

        this.loggedInUser.services.push({
          service_id: 6, type: 3, name: "Web Browser"
        });

        this.loggedInUser.services.map((item: ServiceInterface) => {
          let icon: string = '';
          let width = 0;
          let height = 0;
          let serviceTitle = item.name.split(' ').join('_').toLowerCase();

          switch (serviceTitle) {
            case 'project_microservice':
              icon = 'playlist_add_check';
              width = 1200;
              height = 710;

              break;

            case 'pbx_microservice':
              icon = 'perm_phone_msg';
              width = 350;
              height = 550;

              break;

            case 'video_conference':
              icon = 'picture_in_picture';
              width = 1200;
              height = 710;

              break;

            case 'web_browser':
              icon = 'explore';
              width = 1200;
              height = 710;

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
    this.electronService.window.on('close', () => {
      this.softPhoneService.sipHangUp();
    });

    /*setTimeout(() => {
      this.messageService.durationInSeconds = 10;
      this.messageService.showMessage(`${this.loggedInUser.name} خوش آمدید `);
    }, 2000);*/

    /*this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    // 3 in service id means PBX
    this._subscription.add(
      this.api.getServiceUsers(3).subscribe((resp: any) => {
        if (resp.success) {
          this.userInfoService.changeAllUsers(resp.data);
        }
      })
    );*/
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
