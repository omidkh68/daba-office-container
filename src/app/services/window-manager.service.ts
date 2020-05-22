import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {MatDialog} from '@angular/material/dialog';
import {WindowInterface} from '../components/dashboard/logic/window.interface';
import {ServiceItemsInterface} from '../components/dashboard/logic/service-items.interface';
import {TasksComponent} from '../components/tasks/tasks.component';
import {ConferenceComponent} from '../components/conference/conference.component';
import has = Reflect.has;

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private _defaultWindows: Array<WindowInterface> = [];

  // set observable behavior to property
  private windows = new BehaviorSubject(this._defaultWindows);

  // observable property
  public windowsList = this.windows.asObservable();

  element: HTMLElement;
  cdkOverlayContainer: HTMLElement;

  constructor(public dialog: MatDialog) {
  }

  openWindowState(service: ServiceItemsInterface) {
    let component: any = null;
    let hasFrame: boolean = false;

    switch (service.serviceTitle) {
      case 'service-task': {
        component = TasksComponent;

        break;
      }

      case 'service-conference': {
        component = ConferenceComponent;
        hasFrame = true;

        break;
      }

      case 'service-crm': {
        component = TasksComponent;

        break;
      }

      case 'service-chat': {
        component = TasksComponent;

        break;
      }
    }

    const findIndex = this._defaultWindows.findIndex(windowItem => windowItem.windowService.serviceTitle === service.serviceTitle);

    if (findIndex === -1) {
      try {
        const dialogRef = this.dialog.open(component, {
          data: service,
          autoFocus: false,
          width: '1200px',
          height: '700px',
          hasBackdrop: false,
          panelClass: 'window-dialog'
        });

        const window: WindowInterface = {
          windowRef: dialogRef,
          minimizable: true,
          maximizable: true,
          isMaximized: false,
          isMinimized: false,
          hasFrame: hasFrame,
          resizable: true,
          isDraggable: true,
          windowService: service
        };

        this._defaultWindows.push(window);

        this.windows.next(this._defaultWindows);
      } catch (e) {
      }
    } else {
      this.restoreWindow(service);
    }
  }

  minimizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = true;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('maximized');
    windowInstance.windowRef.addPanelClass('minimized');
    windowInstance.windowRef.updatePosition({bottom: '0'});
  }

  maximizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = true;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.addPanelClass('maximized');
    windowInstance.windowRef.updatePosition({top: '0'});
  }

  restoreWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = true;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.removePanelClass('maximized');
    windowInstance.windowRef.updatePosition({});
  }

  activeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    const dialogId = windowInstance.windowRef.id;

    this.element = document.getElementById(dialogId) as HTMLElement;

    this.cdkOverlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;

    const cdkElements = this.cdkOverlayContainer.children;

    if (!windowInstance.hasFrame) {
      const lastElementId = cdkElements.item(cdkElements.length - 1).querySelector('.mat-dialog-container').getAttribute('id');

      if (dialogId !== lastElementId) {
        const godParentElement = this.element.parentElement.parentElement;

        // const cloneParent = godParentElement;

        // godParentElement.remove();

        this.cdkOverlayContainer.insertAdjacentElement('beforeend', godParentElement);
      }
    } else {
      Object.keys(cdkElements).map(index => {
        let findId = cdkElements.item(index).querySelector('.mat-dialog-container').getAttribute('id');

        if (findId !== dialogId) {
          this.cdkOverlayContainer.insertAdjacentElement('afterbegin', cdkElements.item(index));
        }
      });
    }
  }

  closeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();
    const findIndex = this._defaultWindows.findIndex(window => window.windowService.serviceTitle === service.serviceTitle);

    this._defaultWindows.splice(findIndex, 1);

    windowInstance.windowRef.close();
  }
}
