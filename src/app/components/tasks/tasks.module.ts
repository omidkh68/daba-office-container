import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {JalaliPipe} from '../../pipes/jalali.pipe';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {TaskMainComponent} from './task-main/task-main.component';
import {TaskStopComponent} from './task-stop/task-stop.component';
import {TaskFormComponent} from './task-form/task-form.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TaskBoardComponent} from './task-board/task-board.component';
import {TaskNotesComponent} from './task-notes/task-notes.component';
import {TaskFilesComponent} from './task-files/task-files.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskFilterComponent} from './task-filter/task-filter.component';
import {TaskCurrentComponent} from './task-current/task-current.component';
import {TaskMessagesComponent} from './task-messages/task-messages.component';
import {TaskCalendarComponent} from './task-calendar/task-calendar.component';
import {TaskDetailBottomSheetComponent} from './task-detail-bottomSheet/task-detail-bottomSheet.component';
import {NbLayoutModule, NbWindowModule, NbWindowState} from '@nebular/theme';

@NgModule({
  declarations: [
    JalaliPipe,
    TaskStopComponent,
    TaskMainComponent,
    TaskFormComponent,
    TaskBoardComponent,
    TaskNotesComponent,
    TaskFilesComponent,
    TaskDetailComponent,
    TaskFilterComponent,
    TaskCurrentComponent,
    TaskMessagesComponent,
    TaskCalendarComponent,
    TaskDetailBottomSheetComponent
  ],
  imports: [
    SharedModule,
    FullCalendarModule,
    NbLayoutModule,
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
