import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {JalaliPipe} from '../../pipes/jalali.pipe';
import {SharedModule} from '../../shared/shared.module';
import {NbLayoutModule, NbWindowModule, NbWindowState} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FilePickerModule} from 'ngx-awesome-uploader';
import {TaskAddComponent} from './task-add/task-add.component';
import {TaskMainComponent} from './task-main/task-main.component';
import {TaskStopComponent} from './task-stop/task-stop.component';
import {TaskTodoComponent} from './task-todo/task-todo.component';
import {TaskFormComponent} from './task-form/task-form.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TaskBoardComponent} from './task-board/task-board.component';
/*import {TaskNotesComponent} from './task-notes/task-notes.component';*/
import {TaskFilesComponent} from './task-files/task-files.component';
import {TaskFilterComponent} from './task-filter/task-filter.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskReportComponent} from './task-report/task-report.component';
import {TaskCurrentComponent} from './task-current/task-current.component';
/*import {TaskMessagesComponent} from './task-messages/task-messages.component';*/
import {TaskCalendarComponent} from './task-calendar/task-calendar.component';
import {TaskActivityComponent} from './task-activity/task-activity.component';

@NgModule({
  declarations: [
    JalaliPipe,
    TaskAddComponent,
    TaskStopComponent,
    TaskMainComponent,
    TaskFormComponent,
    TaskTodoComponent,
    TaskBoardComponent,
    /*TaskNotesComponent,*/
    TaskFilesComponent,
    TaskDetailComponent,
    TaskFilterComponent,
    TaskReportComponent,
    TaskCurrentComponent,
    /*TaskMessagesComponent,*/
    TaskCalendarComponent,
    TaskActivityComponent
  ],
  imports: [
    SharedModule,
    NbLayoutModule,
    NgxChartsModule,
    FilePickerModule,
    FullCalendarModule,
    NbWindowModule.forChild({
      title: '',
      initialState: NbWindowState.FULL_SCREEN
    }),
    TranslateModule.forChild({}),
  ],
  exports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TasksModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<TaskMainComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(TaskMainComponent);
  }
}
