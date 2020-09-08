import {Inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TasksComponent} from '../components/tasks/tasks.component';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ElectronService} from './electron.service';
import {SoftPhoneComponent} from '../components/soft-phone/soft-phone.component';
import {AdminPanelComponent} from '../components/admin-panel/admin-panel.component';
import {ConferenceComponent} from '../components/conference/conference.component';
import {WebBrowserComponent} from '../components/web-browser/web-browser.component';
import {ServiceItemsInterface} from '../components/dashboard/logic/service-items.interface';
import {EventsHandlerComponent} from '../components/events/events-handler.component';
import {LearningSystemComponent} from '../components/learning-system/learning-system.component';
import {DialogPositionInterface, WindowInterface} from '../components/dashboard/logic/window.interface';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  element: HTMLElement;
  cdkOverlayContainer: HTMLElement;

  private _defaultWindows: Array<WindowInterface> = [];
  private windows = new BehaviorSubject(this._defaultWindows);
  public windowsList = this.windows.asObservable();

  constructor(public dialog: MatDialog,
              private electron: ElectronService,
              @Inject('windowObject') private window: Window) {
    window.addEventListener('resize', this.fixPositionByTransform.bind(this))
  }

  get windowListArray(): Array<WindowInterface> {
    return this.windows.getValue();
  }

  openWindowState(service: ServiceItemsInterface) {
    let component: any = null;
    let maximizable: boolean = true;
    let windowWidth = service && service.width ? service.width : 0;
    let windowHeight = service && service.height ? service.height : 0;

    try {
      switch (service.serviceTitle) {
        case 'project_service': {
          component = TasksComponent;
          break;
        }

        case 'pbx_service': {
          component = SoftPhoneComponent;
          maximizable = false;
          break;
        }

        case 'conference_service': {
          component = ConferenceComponent;
          break;
        }

        case 'web_browser': {
          component = WebBrowserComponent;
          break;
        }

        case 'events_calender': {
          component = EventsHandlerComponent;
          break;
        }

        case 'admin_panel': {
          component = AdminPanelComponent;
          break;
        }

        case 'learning_service': {
          component = LearningSystemComponent;
          break;
        }
      }

      const findIndex = this.windowListArray.findIndex(windowItem => windowItem.windowService.serviceTitle === service.serviceTitle);

      if (findIndex === -1) {
        // const widthEmptyState = (this.window.innerWidth - windowWidth) / 2;
        /*const widthEmptyState = (Math.random() * (this.window.innerWidth - windowWidth)).toFixed();
        const heightEmptyState = (Math.random() * (this.window.innerHeight - windowHeight)).toFixed();
        const rndNumForWidth = this.randInt(50, widthEmptyState);
        const rndNumForHeight = this.randInt(50, heightEmptyState);

        const position: DialogPositionInterface = {top: `${rndNumForWidth}px`, left: `${rndNumForHeight}px`};*/

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

        let maxZIndex = this.getNextZIndex();

        const mwindow: WindowInterface = {
          windowRef: dialogRef,
          minimizable: true,
          maximizable: maximizable,
          isMaximized: false,
          isMinimized: false,
          isDraggable: true,
          isActive: false,
          resizable: true,
          // position: position,
          windowService: service,
          priority: maxZIndex
        };

        this.windowListArray.push(mwindow);

        this.windows.next(this.windowListArray);

        setTimeout(() => this.activeWindow(service), 200);

        // this.updateWindowPosition(mwindow, false);
      } else {
        this.restoreWindow(service);
      }
    } catch (e) {
      // e
    }
  }

  randInt(min, max) {
    return Math.round((Math.random() * Math.abs(max - min)) + min);
  }

  fixPositionByTransform(event) {
    event.preventDefault();
    this.windowListArray.map((windowInstance: any) => {
      let temp = this.electron;
      let displays = this.electron.remote.screen.getAllDisplays();
      let externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
      });
      let primaryDisplay = displays.find((display) => {
        return display.bounds.x === 0 || display.bounds.y === 0
      });
      if (externalDisplay) {
        const element = windowInstance.windowRef._overlayRef._portalOutlet.outletElement;
        const temp_size = temp.window.getBounds().width - primaryDisplay.bounds.width;
        const size = temp_size / 2;
        element.style.transform = 'translate3d(' + size + 'px, ' + 0 + 'px, 0px)';
      }
    });
  }

  minimizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = true;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('maximized');
    windowInstance.windowRef.addPanelClass('minimized');
    //windowInstance.windowRef.updatePosition({bottom: '0'});
  }

  maximizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = true;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.addPanelClass('maximized');
    // windowInstance.windowRef.updatePosition({top: '0'});

    this.activeWindow(service);
  }

  restoreWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = true;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.removePanelClass('maximized');
    // windowInstance.windowRef.updatePosition(windowInstance.position);

    this.activeWindow(service);
  }

  activeWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    let priority = this.getMaxZIndex();

    const dialogId = windowInstance.windowRef.id;

    this.element = document.querySelector('#' + dialogId) as HTMLElement;

    if (windowInstance.priority === priority) {
      if (this.windowListArray.length === 1) {
        windowInstance.priority = ++priority;
      } else {
        if (this.getExistZIndex(priority)) {
          windowInstance.priority = ++priority;
        } else {
          windowInstance.priority = priority;
        }
      }
    } else if (windowInstance.priority < priority) {
      windowInstance.priority = ++priority;
    }

    this.element.parentElement.parentElement.style.zIndex = windowInstance.priority.toString();

    this.windows.next(this.windowListArray);
  }

  closeWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();
    const findIndex = this.windowListArray.findIndex(window => window.windowService.serviceTitle === service.serviceTitle);

    this.windowListArray.splice(findIndex, 1);

    windowInstance.windowRef.close();
  }

  closeAllServices() {
    return new Promise(async (resolve) => {
      await this.windowListArray.map((item: WindowInterface) => {
        setTimeout(() => this.closeWindow(item.windowService));
      });

      resolve(true);
    });
  }

  centerWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    const centerWidth = (this.window.innerWidth - windowInstance.windowService.width) / 2;
    const centerHeight = (this.window.innerHeight - windowInstance.windowService.height) / 2;

    const updatePosition: DialogPositionInterface = {top: `${centerHeight}px`, left: `${centerWidth}px`};

    //windowInstance.windowRef.updatePosition(updatePosition);
    this.updateWindowPosition(windowInstance, true);

    this.activeWindow(service);
  }

  updateWindowPosition(windowInstance: any, center: boolean) {
    const widthEmptyState = (Math.random() * (this.window.innerWidth - windowInstance.windowService.width)).toFixed();
    const heightEmptyState = (Math.random() * (this.window.innerHeight - windowInstance.windowService.height)).toFixed();
    const rndNumForWidth = this.randInt(50, widthEmptyState);
    const rndNumForHeight = this.randInt(50, heightEmptyState);
    const element = windowInstance.windowRef._overlayRef._portalOutlet.outletElement;
    /*if (center) {
      element.style.transform = null;
    } else {
      element.style.transform = 'translate3d(' + rndNumForWidth + 'px, ' + rndNumForHeight + 'px, 0px)';
    }*/
  }

  getMaxZIndex(): number {
    let zIndex = 1000;

    if (this.windowListArray.length === 1 || this.windowListArray.length === 0) {
      return zIndex;
    }

    return Math.max(...this.windowListArray.map(window => window.priority));
  }

  getNextZIndex(): number {
    let currentZIndex = this.getMaxZIndex();

    if (this.windowListArray.length === 1 || this.windowListArray.length === 0) {
      return currentZIndex;
    }

    return ++currentZIndex;
  }

  getExistZIndex(zIndex: number): boolean {
    let exist = false;

    this.windowListArray.map(window => {
      exist = window.priority === zIndex;
    });

    return exist;
  }

  dialogOnTop(dialogId: string) {
    setTimeout(() => {
      let maxWindowZIndex = (this.getMaxZIndex() + 500).toString();

      let element: HTMLElement;

      if (dialogId !== 'snackBar') {
        const elementOverlay = document.querySelector('.cdk-overlay-backdrop-showing') as HTMLElement;
        elementOverlay.style.zIndex = maxWindowZIndex;

        element = document.querySelector('#' + dialogId) as HTMLElement;
        element.parentElement.parentElement.style.zIndex = maxWindowZIndex;
      } else if (dialogId === 'snackBar') {
        element = document.querySelector('.mat-snack-bar-container') as HTMLElement;
        element.parentElement.parentElement.style.zIndex = maxWindowZIndex;
      }
    });
  }
}
