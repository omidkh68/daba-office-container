import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {MatDialog} from '@angular/material/dialog';
import {WindowInterface} from '../components/dashboard/logic/window.interface';
import {ServiceItemsInterface} from '../components/dashboard/logic/service-items.interface';
import {TasksComponent} from '../components/tasks/tasks.component';

export class WindowManagerService {
  private _defaultWindows: Array<WindowInterface> = [];

  // set observable behavior to property
  private windows = new BehaviorSubject(this._defaultWindows);

  // observable property
  public windowsList = this.windows.asObservable();

  constructor(public dialog: MatDialog) {
  }

  openWindowState(service: ServiceItemsInterface) {
    const dialogRef = this.dialog.open(TasksComponent, {
      data: service,
      autoFocus: false,
      width: '1200px',
      height: '700px',
      hasBackdrop: false,
      panelClass: 'window-dialog'
    });

    const window: WindowInterface = {
      windowId: service.serviceTitle,
      windowRef: dialogRef,
      minimizable: true,
      maximizable: true,
      isMaximized: false,
      isMinimized: false,
      resizable: true,
      windowService: service
    };

    const findIndex = this._defaultWindows.findIndex(window => window.windowId === window.windowId);

    if (findIndex === -1) {
      this._defaultWindows.push(window);

      this.windows.next(this._defaultWindows);
    }
  }

  minimizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = true;
    windowInstance.isMaximized = false;
    windowInstance.windowRef.removePanelClass('maximized');
    windowInstance.windowRef.addPanelClass('minimized');
    windowInstance.windowRef.updatePosition({bottom: '0'});
  }

  maximizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = true;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.addPanelClass('maximized');
    windowInstance.windowRef.updatePosition({top: '0'});
  }

  restoreWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = false;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.removePanelClass('maximized');
    windowInstance.windowRef.updatePosition({});
  }

  closeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();
    const findIndex = this._defaultWindows.findIndex(window => window.windowService.serviceTitle === service.serviceTitle);

    this._defaultWindows.splice(findIndex, 1);

    windowInstance.windowRef.close();
  }
}
