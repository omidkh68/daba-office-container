import {
  AfterViewInit,
  Component,
  ComponentRef,
  Inject,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServiceInterface} from '../services/logic/service-interface';
import {LazyComponentService} from '../../services/lazy-component.service';

@Component({
  selector: 'app-events-handler',
  styleUrls: ['./events-handler.component.scss'],
  templateUrl: './events-handler.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EventsHandlerComponent implements AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private lazyComponentService: LazyComponentService,
              @Inject(MAT_DIALOG_DATA) public data: ServiceInterface) {
  }

  ngAfterViewInit(): void {
    const ref: Promise<ComponentRef<any>> = this.lazyComponentService.loadComponent('eventsHandlerModuleId', this.container);

    ref.then(result => {
      result.instance.data = this.data;
    });
  }
}
