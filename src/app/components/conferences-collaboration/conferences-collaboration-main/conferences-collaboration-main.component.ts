import {Component, Input} from '@angular/core';
import {UserInfoService} from '../../users/services/user-info.service';
import {SoftPhoneService} from '../../soft-phone/service/soft-phone.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ServiceItemsInterface} from '../../dashboard/logic/service-items.interface';

@Component({
  selector: 'app-conferences-collaboration-main',
  templateUrl: './conferences-collaboration-main.component.html',
  styleUrls: ['./conferences-collaboration-main.component.scss']
})
export class ConferencesCollaborationMainComponent {
  @Input()
  windowData: ServiceItemsInterface;

  rtlDirection: boolean;

  constructor(private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private windowManagerService: WindowManagerService) {
  }

  openService(serviceName: string) {
    // setTimeout(() => this.windowManagerService.minimizeWindow(this.windowData), 500);

    const services: Array<ServiceItemsInterface> = this.windowManagerService.serviceList;

    const findService = services.filter(item => item.serviceTitle.includes(serviceName));

    if (findService.length) {
      setTimeout(() => {
        this.windowManagerService.openWindowState(findService[0]).then(() => {
          if (serviceName === 'softphone') {
            this.softPhoneService.getConnectionStatus().then(() => {
              setTimeout(() => this.softPhoneService.changeActiveTab(3), 1000);
            });
          }
        });
      }, 100);
    }
  }
}
