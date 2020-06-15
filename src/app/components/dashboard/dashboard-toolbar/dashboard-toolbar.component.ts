import {Component, Input, ViewEncapsulation} from '@angular/core';
import {WindowInterface} from '../logic/window.interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ServiceItemsInterface} from '../logic/service-items.interface';

@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardToolbarComponent {
  @Input()
  rtlDirection: boolean;

  @Input()
  windowManager: Array<WindowInterface>;

  @Input()
  loggedInUser: UserInterface;

  @Input()
  serviceList: Array<ServiceItemsInterface>;

  constructor() {
  }
}
