import {Component, Input} from '@angular/core';
import {ServiceInterface} from '../../../services/logic/service-interface';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  @Input()
  rtlDirection = false;

  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  serviceList: Array<ServiceInterface>;

  constructor(private windowManagerService: WindowManagerService) {
  }

  openService(service: ServiceInterface): void {
    this.windowManagerService.openWindowState(service);
  }
}
