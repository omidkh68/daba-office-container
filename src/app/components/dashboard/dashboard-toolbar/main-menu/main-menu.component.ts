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
      /*const pbx = this.serviceList[0];
      this.openService(pbx);

      const project = this.serviceList[1];
      this.openService(project);*/

      this.loggedInUser.services.map(userService => {
        const serviceName = userService.name.replace(' ', '_').toLowerCase();

        if (serviceName === 'pbx_microservice') {
          this.serviceList.map(service => {
            if (service.serviceTitle === 'pbx_microservice') {
              this.openService(service);
            }
          })
        }
      });
    }, 200);
  }

  openService(service: ServiceItemsInterface) {
    /*if (!service.status) {
      return;
    }*/

    this.windowManagerService.openWindowState(service);
  }
}
