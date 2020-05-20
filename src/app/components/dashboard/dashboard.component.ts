import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbWindowRef, NbWindowService} from '@nebular/theme';
import {TasksComponent} from '../tasks/tasks.component';
import {ElectronService} from '../../core/services';
import {ServiceItemsInterface} from './logic/service-items.interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatDialog} from '@angular/material/dialog';
import {ChangeStatusComponent} from '../status/change-status/change-status.component';
import {ConferenceComponent} from '../conference/conference.component';
import {ChangeStatusService} from '../../services/change-status.service';
import {UserStatusInterface} from '../users/logic/user-status-interface';
import {ChangeUserStatusInterface} from '../status/logic/change-user-status.interface';
import {ApiService as UserApiService} from '../users/logic/api.service';
import {systemPreferences} from 'electron';
import {UserInterface} from '../users/logic/user-interface';
import {UserInfoService} from '../../services/user-info.service';
import {MessageService} from '../../services/message.service';
import {WindowManagerService} from '../../services/window-manager.service';
import {WindowInterface} from './logic/window.interface';

export interface INotification {
  onclick: () => void;
}

export interface WindowInfo {
  componentName: string;
  ref: NbWindowRef;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [WindowManagerService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  windowManager: Array<WindowInterface>;
  loggedInUser: UserInterface;
  openedWindow: Array<WindowInfo> = [];
  userCurrentStatus: UserStatusInterface | string;
  serviceList: ServiceItemsInterface[] = [
    {
      serviceId: 1,
      serviceNameFa: 'سیستم مدیریت تسک',
      serviceNameEn: 'Task Management System',
      serviceTitle: 'service-task',
      icon: 'playlist_add_check'
    },
    {
      serviceId: 2,
      serviceNameFa: 'سیستم CRM',
      serviceNameEn: 'CRM System',
      serviceTitle: 'service-crm',
      icon: 'device_hub'
    },
    {
      serviceId: 3,
      serviceNameFa: 'سیستم چت',
      serviceNameEn: 'Chat System',
      serviceTitle: 'service-chat',
      icon: 'chat'
    },
    {
      serviceId: 4,
      serviceNameFa: 'سیستم کنفرانس',
      serviceNameEn: 'Conference System',
      serviceTitle: 'service-conference',
      icon: 'perm_phone_msg'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private electronService: ElectronService,
              private windowManagerService: WindowManagerService,
              private windowService: NbWindowService,
              private changeStatusService: ChangeStatusService,
              private userStatusService: ChangeStatusService,
              private userApiService: UserApiService,
              public dialog: MatDialog,
              private messageService: MessageService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    this._subscription.add(
      this.changeStatusService.currentUserStatus.subscribe(status => this.userCurrentStatus = status)
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

  openServiceApi(service: ServiceItemsInterface) {
    let component: any;
    let componentName: string = service.serviceTitle;

    if (this.openedWindow.length) {
      const findOpenWindow = this.openedWindow.findIndex(item => item.componentName === service.serviceTitle);

      if (findOpenWindow !== -1) {
        const ref: NbWindowRef = this.openedWindow[findOpenWindow].ref;

        ref.toPreviousState();

        return;
      }
    }

    switch (service.serviceId) {
      case 1: {
        component = TasksComponent;
        break;
      }

      case 2: {
        component = TasksComponent;
        break;
      }

      case 3: {
        component = TasksComponent;
        break;
      }

      case 4: {
        component = ConferenceComponent;
        break;
      }
    }

    const className = service.serviceNameEn.replace(' ', '_').replace(' ', '_').toLowerCase();

    const windowRef = this.windowService.open(component, {
      title: service.serviceNameFa,
      windowClass: className
    });

    windowRef.stateChange.subscribe(state => {
      if (state.oldState === undefined) {
        this.openedWindow.push(
          {
            componentName: componentName,
            ref: windowRef
          }
        );
      }
    });

    windowRef.onClose.subscribe(result => {
      const findIndex = this.openedWindow.findIndex(item => item.componentName === service.serviceTitle);

      this.openedWindow.splice(findIndex, 1);
    });
  }

  changeStatus(startStatus: boolean) {
    if (startStatus) {
      const dialogRef = this.dialog.open(ChangeStatusComponent, {
        autoFocus: false,
        width: '500px',
        height: '355px',
        panelClass: 'status-dialog'
      });

      this._subscription.add(
        dialogRef.afterClosed().subscribe((resp: any) => {
          if (resp) {
            this.messageService.showMessage(`${resp.message}`);
          }
        })
      );
    } else {
      const statusInfo: ChangeUserStatusInterface = {
        userId: 1,
        assigner: 1,
        statusTime: 'stop'
      };

      this._subscription.add(
        this.userApiService.applyStatusToUser(statusInfo).subscribe((resp: any) => {
          if (resp.result === 1) {
            this.messageService.showMessage(`${resp.message}`);

            this.changeStatusService.changeUserStatus(resp.content.user.userCurrentStatus);
          }
        })
      );
    }
  }

  openTaskWindow(windowName: string) {
    const service: ServiceItemsInterface = this.serviceList.filter(item => item.serviceTitle === windowName).pop();

    this.windowManagerService.openWindowState(service);
  }

  closeApp() {
    const window = this.electronService.remote.getCurrentWindow();

    window.close();
  }

  minimizeApp() {
    const window = this.electronService.remote.getCurrentWindow();

    window.minimize();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
