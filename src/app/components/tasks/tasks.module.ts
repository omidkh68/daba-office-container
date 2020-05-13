import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {TaskStopComponent} from './task-stop/task-stop.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TaskBoardComponent} from './task-board/task-board.component';
import {TaskNotesComponent} from './task-notes/task-notes.component';
import {TaskFilesComponent} from './task-files/task-files.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskFilterComponent} from './task-filter/task-filter.component';
import {TaskCurrentComponent} from './task-current/task-current.component';
import {TaskMessagesComponent} from './task-messages/task-messages.component';
import {TaskCalendarComponent} from './task-calendar/task-calendar.component';
import {TaskCalendarWeekdayComponent} from './task-calendar/task-calendar-weekday/task-calendar-weekday.component';
import {TaskCalendarRateComponent} from './task-calendar/task-calendar-rate/task-calendar-rate.component';
import {TaskMainComponent} from './task-main/task-main.component';
import {NbLayoutModule, NbWindowModule, NbWindowState} from '@nebular/theme';
import {A11yModule} from "@angular/cdk/a11y";

@NgModule({
  declarations: [
    TaskBoardComponent,
    TaskNotesComponent,
    TaskFilesComponent,
    TaskDetailComponent,
    TaskFilterComponent,
    TaskCurrentComponent,
    TaskMessagesComponent,
    TaskCalendarComponent,
    TaskCalendarWeekdayComponent,
    TaskCalendarRateComponent,
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
        TranslateModule.forChild({}),
        A11yModule,
    ],
  exports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TasksModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<TaskMainComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(TaskMainComponent);
  }
}
