import {AfterViewInit, Component, Inject, ViewChild, ViewContainerRef} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServiceInterface} from '../services/logic/service-interface';
import {LazyComponentService} from '../../services/lazy-component.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html'
})
export class ConferenceComponent implements AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private lazyComponentService: LazyComponentService,
              @Inject(MAT_DIALOG_DATA) public data: ServiceInterface) {
  }

  async ngAfterViewInit() {
    const ref = this.lazyComponentService.loadComponent('conferenceModuleId', this.container);

    ref.then(result => {
      result.instance.data = this.data;
    });
  }
}
