import {Component, Input} from '@angular/core';
import {ServiceItemsInterface} from '../../logic/service-items.interface';
import {WindowManagerService} from '../../../../services/window-manager.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  @Input()
  rtlDirection: boolean;

  @Input()
  serviceList: Array<ServiceItemsInterface>;

  constructor(private windowManagerService: WindowManagerService) {
    /*setTimeout(() => {
      const service = this.serviceList[0];
      this.openService(service);
    }, 500);*/
  }

  openService(service: ServiceItemsInterface) {
    /*if (!service.status) {
      return;
    }*/

    this.windowManagerService.openWindowState(service);
  }
}
