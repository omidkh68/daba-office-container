import {Component, OnInit} from '@angular/core';
import {NbWindowService} from '@nebular/theme';
import {TasksComponent} from '../tasks/tasks.component';
import {ElectronService} from '../../core/services';
import {ServiceItemsInterface} from './service-items.interface';
// import {TaskMainComponent} from '../tasks/task-main/task-main.component';

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

  constructor(private electronService: ElectronService,
              private windowService: NbWindowService) {
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
        component = TasksComponent;
        break;
      }
    }

    const windowRef = this.windowService.open(component, {
      title: service.serviceNameFa,
      windowClass: 'custom-window'
    });
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
