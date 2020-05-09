import {Component, OnInit} from '@angular/core';
import {NbWindowService} from '@nebular/theme';
import {TasksComponent} from '../tasks/tasks.component';
import {ElectronService} from '../../core/services';
import {ServiceItemsInterface} from './logic/service-items.interface';
import {StatusItemsInterface} from './logic/status-items.interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatDialog} from '@angular/material/dialog';
import {ChangeStatusComponent} from '../status/change-status/change-status.component';
import {ConferenceComponent} from '../conference/conference.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  serviceList: ServiceItemsInterface[] = [
    {
      serviceId: 1,
      serviceNameFa: 'سیستم مدیریت تسک',
      serviceNameEn: 'Task Management System',
      classList: 'service-task-management',
      icon: 'playlist_add_check'
    },
    {
      serviceId: 2,
      serviceNameFa: 'سیستم CRM',
      serviceNameEn: 'CRM System',
      classList: 'service-crm',
      icon: 'device_hub'
    },
    {
      serviceId: 3,
      serviceNameFa: 'سیستم چت',
      serviceNameEn: 'Chat System',
      classList: 'service-chat',
      icon: 'chat'
    },
    {
      serviceId: 4,
      serviceNameFa: 'سیستم کنفرانس',
      serviceNameEn: 'Conference System',
      classList: 'service-conference',
      icon: 'perm_phone_msg'
    }
  ];

  statusList: StatusItemsInterface[] = [
    {
      statusId: 1,
      statusNameEn: 'Lunch Time',
      statusNameFa: 'وقت ناهار',
      icon: ''
    },
    {
      statusId: 2,
      statusNameEn: 'Meeting',
      statusNameFa: 'جلسه',
      icon: ''
    },
    {
      statusId: 3,
      statusNameEn: 'Smoking',
      statusNameFa: 'سیگار کشیدن',
      icon: ''
    },
    {
      statusId: 4,
      statusNameEn: 'Mission',
      statusNameFa: 'مأموریت',
      icon: ''
    },
    {
      statusId: 5,
      statusNameEn: 'Leave',
      statusNameFa: 'مرخصی',
      icon: ''
    },
    {
      statusId: 8,
      statusNameEn: 'Other',
      statusNameFa: 'موارد دیگر',
      icon: ''
    },
    {
      statusId: 9,
      statusNameEn: 'Game',
      statusNameFa: 'بازی',
      icon: ''
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private electronService: ElectronService,
              private windowService: NbWindowService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openApi(service: ServiceItemsInterface) {
    let component: any;

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

    const windowRef = this.windowService.open(component, {
      title: service.serviceNameFa,
      windowClass: 'custom-window'
    });
  }

  changeStatus() {
    const dialogRef = this.dialog.open(ChangeStatusComponent, {
      autoFocus: false,
      width: '500px',
      height: '300px'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe(resp => {

      })
    );
  }

  closeApp() {
    const window = this.electronService.remote.getCurrentWindow();

    window.close();
  }

  minimizeApp() {
    const window = this.electronService.remote.getCurrentWindow();

    window.minimize();
  }
}
