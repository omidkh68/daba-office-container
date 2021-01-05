import {Component, Input, ViewChild} from '@angular/core';
import {MatMenuTrigger} from '@angular/material/menu';
import {WindowInterface} from '../../logic/window.interface';
import {WindowManagerService} from '../../../../services/window-manager.service';

@Component({
  selector: 'app-window-app-container',
  templateUrl: './window-app-container.component.html'
})
export class WindowAppContainerComponent {
  @Input()
  rtlDirection: boolean;

  @Input()
  windowManager: Array<WindowInterface>;

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextMenuPosition = {x: '0px', y: '0px'};

  constructor(private windowManagerService: WindowManagerService) {
  }

  onContextMenu(event: any, app: WindowInterface) {
    event.preventDefault();

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = {'app': app};
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  minimize(app: WindowInterface) {
    this.windowManagerService.minimizeWindow(app.windowService);

    this.contextMenu.closeMenu();
  }

  restore(app: WindowInterface) {
    this.windowManagerService.restoreWindow(app.windowService);

    this.contextMenu.closeMenu();
  }

  maximize(app: WindowInterface) {
    this.windowManagerService.maximizeWindow(app.windowService);

    this.contextMenu.closeMenu();
  }

  active(app: WindowInterface) {
    this.windowManagerService.activeWindow(app.windowService);

    this.contextMenu.closeMenu();
  }

  close(app: WindowInterface) {
    this.windowManagerService.closeWindow(app.windowService);

    this.contextMenu.closeMenu();
  }

  controlWindow(app: WindowInterface) {
    if (app.isMinimized) {
      this.windowManagerService.restoreWindow(app.windowService);
    } else if (!app.isMinimized) {
      this.windowManagerService.minimizeWindow(app.windowService);
    }
  }
}
