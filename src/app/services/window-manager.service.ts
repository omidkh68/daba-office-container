import {Inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TasksComponent} from '../components/tasks/tasks.component';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {SoftPhoneComponent} from '../components/soft-phone/soft-phone.component';
import {ConferenceComponent} from '../components/conference/conference.component';
import {ServiceItemsInterface} from '../components/dashboard/logic/service-items.interface';
import {DialogPositionInterface, WindowInterface} from '../components/dashboard/logic/window.interface';

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

  constructor(public dialog: MatDialog,
              @Inject('windowObject') private window: Window) {
  }

  get windowListArray(): Array<WindowInterface> {
    return this.windows.getValue();
  }

  openWindowState(service: ServiceItemsInterface) {
    let component: any = null;
    let hasFrame: boolean = false;
    let maximizable: boolean = true;
    let windowWidth = service.width;
    let windowHeight = service.height;

    switch (service.serviceTitle) {
      case 'service-task': {
        component = TasksComponent;

        break;
      }

      case 'service-pbx': {
        component = SoftPhoneComponent;
        maximizable = false;

        break;
      }

      case 'service-video-conference': {
        component = ConferenceComponent;
        hasFrame = true;

        break;
      }
    }

    const findIndex = this._defaultWindows.findIndex(windowItem => windowItem.windowService.serviceTitle === service.serviceTitle);

    if (findIndex === -1) {
      try {
        // const widthEmptyState = (this.window.innerWidth - windowWidth) / 2;
        const widthEmptyState = (Math.random() * (this.window.innerWidth - windowWidth)).toFixed();
        const heightEmptyState = (Math.random() * (this.window.innerWidth - windowWidth)).toFixed();


        const rndNumForWidth = this.randint(50, widthEmptyState);
        const rndNumForHeight = this.randint(50, heightEmptyState);

        const position: DialogPositionInterface = {top: `${rndNumForWidth}px`, left: `${rndNumForHeight}px`};

        const dialogRef = this.dialog.open(component, {
          data: service,
          autoFocus: false,
          width: `${windowWidth}px`,
          height: `${windowHeight}px`,
          hasBackdrop: false,
          panelClass: 'window-dialog',
          disableClose: true,
          // position: {top: `${rndNumForWidth}px`, left: `${rndNumForHeight}px`}
        });

        const window: WindowInterface = {
          windowRef: dialogRef,
          minimizable: true,
          maximizable: maximizable,
          isMaximized: false,
          isMinimized: false,
          isDraggable: true,
          isActive: false,
          hasFrame: hasFrame,
          resizable: true,
          position: position,
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

  randint(min, max) {
    return Math.round((Math.random() * Math.abs(max - min)) + min);
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
    // windowInstance.windowRef.updatePosition({top: '0'});
  }

  restoreWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = true;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.removePanelClass('maximized');
    // windowInstance.windowRef.updatePosition(windowInstance.position);

    this.activeWindow(service);
  }

  activeWindow(service: ServiceItemsInterface) {
    if (this._defaultWindows.length === 1) {
      return;
    }

    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    const dialogId = windowInstance.windowRef.id;

    this.element = document.getElementById(dialogId) as HTMLElement;

    this.cdkOverlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;

    const cdkElements = this.cdkOverlayContainer.children;

    try {
      if (!windowInstance.hasFrame) {
        const lastElementId = cdkElements.item(cdkElements.length - 1).querySelector('.mat-dialog-container').getAttribute('id');

        if (dialogId !== lastElementId) {
          const godParentElement = this.element.parentElement.parentElement;

          this.cdkOverlayContainer.insertAdjacentElement('beforeend', godParentElement);
        }
      } else {
        Object.keys(cdkElements).map((value, index) => {
          let findId = cdkElements.item(index).querySelector('.mat-dialog-container').getAttribute('id');

          if (findId !== dialogId) {
            this.cdkOverlayContainer.insertAdjacentElement('afterbegin', cdkElements.item(index));
          }
        });
      }
    } catch (e) {
    }
  }

  closeWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();
    const findIndex = this._defaultWindows.findIndex(window => window.windowService.serviceTitle === service.serviceTitle);

    this._defaultWindows.splice(findIndex, 1);

    windowInstance.windowRef.close();
  }

  closeAllServices() {
    return new Promise(async (resolve, reject) => {
      await this.windowListArray.map((item: WindowInterface) => {
        setTimeout(() => {
          this.closeWindow(item.windowService);
        });
      });

      resolve(true);
    });
  }

  centerWindow(service: ServiceItemsInterface) {
    const windowInstance = this._defaultWindows.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    const centerWidth = (this.window.innerWidth - windowInstance.windowService.width) / 2;
    const centerHeight = (this.window.innerHeight - windowInstance.windowService.height) / 2;

    const updatePosition: DialogPositionInterface = {top: `${centerHeight}px`, left: `${centerWidth}px`};

    windowInstance.windowRef.updatePosition(updatePosition);

    this.activeWindow(service);
  }
}
