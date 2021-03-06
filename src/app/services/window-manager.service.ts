import {Inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TasksComponent} from '../components/tasks/tasks.component';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {WindowInterface} from '../components/dashboard/logic/window.interface';
import {ElectronService} from '../core/services';
import {ServiceInterface} from '../components/services/logic/service-interface';
import {SoftPhoneComponent} from '../components/soft-phone/soft-phone.component';
import {AdminPanelComponent} from '../components/admin-panel/admin-panel.component';
import {ConferenceComponent} from '../components/conference/conference.component';
import {WebBrowserComponent} from '../components/web-browser/web-browser.component';
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

  private _services: Array<ServiceInterface> | null = null;
  private services = new BehaviorSubject(this._services);

  constructor(@Inject('windowObject') private window: Window,
              public dialog: MatDialog,
              private electronService: ElectronService) {
    if (this.electronService.isElectron) {
      window.addEventListener('resize', this.fixPositionByTransform.bind(this));
    }
  }

  get windowListArray(): Array<WindowInterface> {
    return this.windows.getValue();
  }

  get serviceList(): Array<ServiceInterface> {
    return this.services.getValue();
  }

  changeServices(services: Array<ServiceInterface> | null): void {
    this.services.next(services);
  }

  openWindowState(service: ServiceInterface): Promise<boolean> {
    return new Promise((resolve) => {
      let component: any = null;
      let maximizable = true;
      const windowWidth = service && service.width ? service.width : 0;
      const windowHeight = service && service.height ? service.height : 0;

      try {
        switch (service.service_name) {
          case 'project': {
            component = TasksComponent;
            break;
          }

          case 'pbx': {
            component = SoftPhoneComponent;
            maximizable = false;
            break;
          }

          case 'conference': {
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

          case 'learning': {
            component = LearningSystemComponent;
            break;
          }

          case 'conferences_collaboration': {
            component = ConferencesCollaborationComponent;
            break;
          }
        }

        const findIndex = this.windowListArray.findIndex(windowItem => windowItem.windowService.service_name === service.service_name);

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

          const maxZIndex = this.getNextZIndex();

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
        //
      }
    });
  }

  fixPositionByTransform(event: Event): void {
    event.preventDefault();

    this.windowListArray.map((windowInstance: any) => {
      const displays = this.electronService.remote.screen.getAllDisplays();
      const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
      });

      const primaryDisplay = displays.find((display) => {
        return display.bounds.x === 0 || display.bounds.y === 0;
      });

      if (externalDisplay) {
        const element = windowInstance.windowRef._overlayRef._portalOutlet.outletElement;
        const temp_size = this.electronService.remote.getCurrentWindow().getBounds().width - primaryDisplay.bounds.width;
        const size = temp_size / 2;
        element.style.transform = `translate3d(${size}px, 0px, 0px)`;
      }
    });
  }

  minimizeWindow(service: ServiceInterface): void {
    const windowInstance = this.windowListArray.filter(window => window.windowService.service_name === service.service_name).pop();

    windowInstance.isMinimized = true;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('maximized');
    windowInstance.windowRef.addPanelClass('minimized');
  }

  maximizeWindow(service: ServiceInterface): void {
    const windowInstance = this.windowListArray.filter(window => window.windowService.service_name === service.service_name).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = true;
    windowInstance.isDraggable = false;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.addPanelClass('maximized');

    this.activeWindow(service);
  }

  restoreWindow(service: ServiceInterface): void {
    const windowInstance = this.windowListArray.filter(window => window.windowService.service_name === service.service_name).pop();

    windowInstance.isMinimized = false;
    windowInstance.isMaximized = false;
    windowInstance.isDraggable = true;
    windowInstance.windowRef.removePanelClass('minimized');
    windowInstance.windowRef.removePanelClass('maximized');

    this.activeWindow(service);
  }

  activeWindow(service: ServiceInterface): void {
    const windowInstance = this.windowListArray.filter(window => window.windowService.service_name === service.service_name).pop();

    let priority = this.getMaxZIndex();

    const dialogId = windowInstance.windowRef.id;

    this.element = document.querySelector('#' + dialogId) ;

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

    this.windows.next(
      this.windowListArray.map((window: WindowInterface) => {
        window.isActive = window.windowService.service_name === service.service_name;

        return window;
      })
    );

    this.windows.next(this.windowListArray);
  }

  closeWindow(service: ServiceInterface): void {
    const windowInstance = this.windowListArray.filter(window => window.windowService.service_name === service.service_name).pop();
    const findIndex = this.windowListArray.findIndex(window => window.windowService.service_name === service.service_name);

    this.windowListArray.splice(findIndex, 1);

    windowInstance.windowRef.close();
  }

  closeAllServices(): Promise<boolean> {
    return new Promise((resolve) => {
      this.windowListArray.map((item: WindowInterface) => {
        setTimeout(() => this.closeWindow(item.windowService));
      });

      resolve(true);
    });
  }

  centerWindow(): void {
    // const dialogId = windowInstance.windowRef.id;
    //
    // this.element = document.querySelector('#' + dialogId) as HTMLElement;
    //
    // this.element.parentElement.style.transform = 'translate3d(0, 0, 0)';
    //
    // this.activeWindow(windowInstance.windowService);
  }

  getMaxZIndex(): number {
    const zIndex = 1000;

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

  dialogOnTop(dialogId: string): void {
    setTimeout(() => {
      const maxWindowZIndex = (this.getMaxZIndex() + 500).toString();

      let element: HTMLElement;

      if (dialogId === 'snackBar') {
        element = document.querySelector('.mat-snack-bar-container') ;
        element.parentElement.parentElement.style.zIndex = maxWindowZIndex;
      } else if (dialogId === 'popover') {
        setTimeout(() => {
          element = document.querySelector('.cdk-overlay-backdrop-showing') ;
          element.style.zIndex = maxWindowZIndex;
        }, 100);
      } else {
        const overlayHtmlElements = document.getElementsByClassName('cdk-overlay-backdrop-showing');

        if (overlayHtmlElements.length === 1) {
          const elementOverlay = overlayHtmlElements[0] as HTMLElement;
          elementOverlay.style.zIndex = maxWindowZIndex;
          element = document.querySelector('#' + dialogId) ;
          element.parentElement.parentElement.style.zIndex = maxWindowZIndex;
        } else if (overlayHtmlElements.length > 1) {
          // if dialog open on another dialog, second overlay has to more z-index
          const elementOverlay = overlayHtmlElements[1] as HTMLElement;
          const maxZIndex = (parseInt(maxWindowZIndex, 10) + 11).toString();

          elementOverlay.style.zIndex = maxZIndex;
          element = document.querySelector('#' + dialogId) ;
          element.parentElement.parentElement.style.zIndex = maxZIndex;
        }
      }
    }, 50);
  }
}
