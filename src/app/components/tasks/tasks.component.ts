import {AfterViewInit, Component, Inject, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {LazyComponentService} from '../../services/lazy-component.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {WindowManagerService} from '../../services/window-manager.service';
import {WindowInterface} from '../dashboard/logic/window.interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {ServiceItemsInterface} from '../dashboard/logic/service-items.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  providers: [WindowManagerService]
})
export class TasksComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {read: ViewContainerRef}) container;
  windowInstance: WindowInterface;

  canDrag: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(private lazyComponentService: LazyComponentService,
              private windowManagerService: WindowManagerService,
              @Inject(MAT_DIALOG_DATA) public data: ServiceItemsInterface) {
    this._subscription.add(
      this.windowManagerService.windowsList.subscribe(window => {
        this.windowInstance = window.filter(item => item.windowId === this.data.serviceTitle).pop();
      })
    );
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.canDrag = true;
    }, 500);

    this.lazyComponentService.loadComponent('tasksModuleId', this.container);
  }

  minimize() {
    this.windowManagerService.minimizeWindow(this.data);
    this.canDrag = false;
  }

  maximize() {
    this.windowManagerService.maximizeWindow(this.data);
    this.canDrag = false;
  }

  restore() {
    this.windowManagerService.restoreWindow(this.data);
    this.canDrag = true;
  }

  close() {
    this.windowManagerService.closeWindow(this.data);
    this.canDrag = true;
  }

  ngOnDestroy(): void {
    console.log('des task');

    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
