import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {LazyComponentService} from '../../services/lazy-component.service';
import {NbWindowRef} from '@nebular/theme';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private lazyComponentService: LazyComponentService,
              private windowRef: NbWindowRef) {
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.lazyComponentService.loadComponent('tasksModuleId', this.container);
  }

  ngOnDestroy(): void {
    console.log('des task');
  }
}