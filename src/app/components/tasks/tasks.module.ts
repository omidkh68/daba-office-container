import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {TasksComponent} from './tasks.component';
import {TranslateModule} from '@ngx-translate/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TaskBoardComponent} from './task-board/task-board.component';
import {TaskNotesComponent} from './task-notes/task-notes.component';
import {TaskFilesComponent} from './task-files/task-files.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskFilterComponent} from './task-filter/task-filter.component';
import {TaskCurrentComponent} from './task-current/task-current.component';
import {TaskMessagesComponent} from './task-messages/task-messages.component';
import {TaskCalendarComponent} from './task-calendar/task-calendar.component';

@NgModule({
  declarations: [
    TasksComponent,
    TaskBoardComponent,
    TaskNotesComponent,
    TaskFilesComponent,
    TaskDetailComponent,
    TaskFilterComponent,
    TaskCurrentComponent,
    TaskMessagesComponent,
    TaskCalendarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FullCalendarModule,
    RouterModule.forChild([
      {path: '', component: TasksComponent},
    ]),
    TranslateModule.forChild({}),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TaskDetailComponent, TaskFilterComponent],
})
export class TasksModule {
}
