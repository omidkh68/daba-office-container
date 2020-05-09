import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {LazyComponentService} from '../../services/lazy-component.service';
import {NbWindowRef} from '@nebular/theme';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, AfterViewInit, OnDestroy {
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
