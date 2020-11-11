import {AfterViewInit, Component, Inject, ViewChild, ViewContainerRef} from '@angular/core';
import {LazyComponentService} from '../../services/lazy-component.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServiceInterface} from '../services/logic/service-interface';

@Component({
  selector: 'app-conference',
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private lazyComponentService: LazyComponentService,
              @Inject(MAT_DIALOG_DATA) public data: ServiceInterface) {
  }

  async ngAfterViewInit() {
    const ref = this.lazyComponentService.loadComponent('adminPanelModuleId', this.container);

    ref.then(result => {
      result.instance.data = this.data;
    });
  }
}
