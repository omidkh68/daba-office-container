import {Component, Input} from '@angular/core';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {ServiceItemsInterface} from '../../logic/service-items.interface';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  @Input()
  rtlDirection: boolean;

  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  serviceList: Array<ServiceItemsInterface>;

  constructor(private windowManagerService: WindowManagerService) {
    setTimeout(() => {

      this.loggedInUser.services.map(userService => {
        const serviceName = userService.name.replace(' ', '_').toLowerCase();

        if (serviceName === 'pbx_service') {
          this.serviceList.map(service => {
            if (service.serviceTitle === 'pbx_service') {
              this.openService(service);

              setTimeout(() => this.windowManagerService.minimizeWindow(service), 1000);
            }
          })
        }
      });
    }, 200);
  }

  openService(service: ServiceItemsInterface) {
    this.windowManagerService.openWindowState(service);
  }
}
