import {Component, Input} from '@angular/core';
import {WindowInterface} from '../../logic/window.interface';
import {WindowManagerService} from '../../../../services/window-manager.service';

@Component({
  selector: 'app-window-app-container',
  templateUrl: './window-app-container.component.html',
  styleUrls: ['./window-app-container.component.scss']
})
export class WindowAppContainerComponent {
  @Input()
  rtlDirection: boolean;

  @Input()
  windowManager: Array<WindowInterface>;

  constructor(private windowManagerService: WindowManagerService) {
  }

  controlWindow(app: WindowInterface) {
    if (app.isMinimized) {
      this.windowManagerService.restoreWindow(app.windowService);
    } else if (!app.isMinimized) {
      this.windowManagerService.minimizeWindow(app.windowService);
    }
  }
}
