import {AfterViewInit, Component, Inject, ViewChild, ViewContainerRef} from '@angular/core';
import {LazyComponentService} from '../../services/lazy-component.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServiceItemsInterface} from '../dashboard/logic/service-items.interface';

@Component({
  selector: 'app-learning-system',
  templateUrl: './learning-system.component.html'
})
export class LearningSystemComponent implements AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private lazyComponentService: LazyComponentService,
              @Inject(MAT_DIALOG_DATA) public data: ServiceItemsInterface) {
  }

  async ngAfterViewInit() {
    const ref = this.lazyComponentService.loadComponent('learningSystemModuleId', this.container);

    ref.then(result => {
      result.instance.data = this.data;
    });
  }
}
