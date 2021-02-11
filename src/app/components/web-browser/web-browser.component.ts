import {AfterViewInit, Component, ComponentRef, Inject, ViewChild, ViewContainerRef} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServiceInterface} from '../services/logic/service-interface';
import {LazyComponentService} from '../../services/lazy-component.service';

@Component({
  selector: 'app-conference',
  templateUrl: './web-browser.component.html'
})
export class WebBrowserComponent implements AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private lazyComponentService: LazyComponentService,
              @Inject(MAT_DIALOG_DATA) public data: ServiceInterface) {
  }

  ngAfterViewInit(): void {
    const ref: Promise<ComponentRef<any>> = this.lazyComponentService.loadComponent('webBrowserModuleId', this.container);

    ref.then(result => {
      result.instance.data = this.data;
    });
  }
}
