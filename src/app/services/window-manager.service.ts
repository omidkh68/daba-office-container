import {Inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TasksComponent} from '../components/tasks/tasks.component';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {WindowInterface} from '../components/dashboard/logic/window.interface';
import {SoftPhoneComponent} from '../components/soft-phone/soft-phone.component';
import {AdminPanelComponent} from '../components/admin-panel/admin-panel.component';
import {ConferenceComponent} from '../components/conference/conference.component';
import {WebBrowserComponent} from '../components/web-browser/web-browser.component';
import {ServiceItemsInterface} from '../components/dashboard/logic/service-items.interface';
import {EventsHandlerComponent} from '../components/events/events-handler.component';
import {LearningSystemComponent} from '../components/learning-system/learning-system.component';
import {ConferencesCollaborationComponent} from '../components/conferences-collaboration/conferences-collaboration.component';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  element: HTMLElement;

  private _defaultWindows: Array<WindowInterface> = [];
  private windows = new BehaviorSubject(this._defaultWindows);
  public windowsList = this.windows.asObservable();

  private _services: Array<ServiceItemsInterface> | null = null;
  private services = new BehaviorSubject(this._services);

  constructor(public dialog: MatDialog,
              @Inject('windowObject') private window: Window) {
    window.addEventListener('resize', this.fixPositionByTransform.bind(this))
  }

  get windowListArray(): Array<WindowInterface> {
    return this.windows.getValue();
  }

  get serviceList(): Array<ServiceItemsInterface> {
    return this.services.getValue();
  }

  changeServices(services: Array<ServiceItemsInterface> | null) {
    this.services.next(services);
  }

  openWindowState(service: ServiceItemsInterface) {
    return new Promise((resolve) => {
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

          case 'softphones_service': {
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

          case 'events_calendar': {
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

          case 'conferences_&_collaboration_services': {
            component = ConferencesCollaborationComponent;
            break;
          }
        }

        const findIndex = this.windowListArray.findIndex(windowItem => windowItem.windowService.serviceTitle === service.serviceTitle);

        if (findIndex === -1) {
          const dialogRef = this.dialog.open(component, {
            data: service,
            autoFocus: false,
            width: `${windowWidth}px`,
            height: `${windowHeight}px`,
            hasBackdrop: false,
            panelClass: 'window-dialog',
            disableClose: true,
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

          setTimeout(() => {
            this.activeWindow(service);

            resolve(true);
          }, 200);
        } else {
          this.restoreWindow(service);

          resolve(true);
        }
      } catch (e) {
      }
    });
  }

  fixPositionByTransform(event) {
    // TODO By Husin - Comment for Web App
    /*event.preventDefault();
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
    });*/
  }

  minimizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = true;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('maximized');
    windowInstance.windowRef.addPanelClass('minimized');
  }

  maximizeWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = true;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.addPanelClass('maximized');

    this.activeWindow(service);
  }

  restoreWindow(service: ServiceItemsInterface) {
    const windowInstance = this.windowListArray.filter(window => window.windowService.serviceTitle === service.serviceTitle).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = true;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.removePanelClass('maximized');

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

  centerWindow() {
    // const dialogId = windowInstance.windowRef.id;
    //
    // this.element = document.querySelector('#' + dialogId) as HTMLElement;
    //
    // this.element.parentElement.style.transform = 'translate3d(0, 0, 0)';
    //
    // this.activeWindow(windowInstance.windowService);
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
      //debugger;
    setTimeout(() => {
      let maxWindowZIndex = (this.getMaxZIndex() + 500).toString();

      let element: HTMLElement;

      if (dialogId === 'snackBar') {
        element = document.querySelector('.mat-snack-bar-container') as HTMLElement;
        element.parentElement.parentElement.style.zIndex = maxWindowZIndex;
      } else if (dialogId === 'popover') {
        setTimeout(() => {
          element = document.querySelector('.cdk-overlay-backdrop-showing') as HTMLElement;
          element.style.zIndex = maxWindowZIndex;
        }, 100);
      } else {
        const overlayHtmlElements = document.getElementsByClassName('cdk-overlay-backdrop-showing');

        if (overlayHtmlElements.length === 1) {
          const elementOverlay = overlayHtmlElements[0] as HTMLElement;
          elementOverlay.style.zIndex = maxWindowZIndex;
          element = document.querySelector('#' + dialogId) as HTMLElement;
          element.parentElement.parentElement.style.zIndex = maxWindowZIndex;
        } else if (overlayHtmlElements.length > 1) {
          // if dialog open on another dialog, second overlay has to more z-index
          let elementOverlay = overlayHtmlElements[1] as HTMLElement;
          let maxZIndex = (parseInt(maxWindowZIndex, 10) + 11).toString();

          elementOverlay.style.zIndex = maxZIndex;
          element = document.querySelector('#' + dialogId) as HTMLElement;
          element.parentElement.parentElement.style.zIndex = maxZIndex;
        }
      }
    },0)
  }
}
