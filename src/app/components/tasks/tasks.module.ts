import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
// import {TasksComponent} from './tasks.component';
import {TranslateModule} from '@ngx-translate/core';
import {TaskStopComponent} from './task-stop/task-stop.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TaskBoardComponent} from './task-board/task-board.component';
import {TaskNotesComponent} from './task-notes/task-notes.component';
import {TaskFilesComponent} from './task-files/task-files.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskFilterComponent} from './task-filter/task-filter.component';
import {TaskCurrentComponent} from './task-current/task-current.component';
// import {TaskMessagesComponent} from './task-messages/task-messages.component';
import {TaskCalendarComponent} from './task-calendar/task-calendar.component';
import {TaskMainComponent} from './task-main/task-main.component';
import {NbLayoutModule, NbWindowModule, NbWindowState} from '@nebular/theme';

@NgModule({
  declarations: [
    // TaskMainComponent,
    TaskBoardComponent,
    TaskNotesComponent,
    TaskFilesComponent,
    TaskDetailComponent,
    TaskFilterComponent,
    TaskCurrentComponent,
    //TaskMessagesComponent,
    TaskCalendarComponent,
    TaskStopComponent,
    TaskMainComponent
  ],
  imports: [
    SharedModule,
    FullCalendarModule,
    NbLayoutModule,
    NbWindowModule.forChild({
      title: '',
      initialState: NbWindowState.FULL_SCREEN
    }),
    /*RouterModule.forChild([
      {path: '', component: TaskMainComponent},
    ]),*/
    TranslateModule.forChild({}),
  ],
  exports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // entryComponents: [TaskDetailComponent, TaskFilterComponent, TaskStopComponent, TaskMainComponent],
})
export class TasksModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<TaskMainComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(TaskMainComponent);
  }
}
