import {ComponentFactory, ComponentFactoryResolver, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TaskAddComponent} from './task-add/task-add.component';
import {TaskMainComponent} from './task-main/task-main.component';
import {TaskStopComponent} from './task-stop/task-stop.component';
import {TaskTodoComponent} from './task-todo/task-todo.component';
import {TaskFormComponent} from './task-form/task-form.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {TaskBoardComponent} from './task-board/task-board.component';
import {TaskFilterComponent} from './task-filter/task-filter.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskReportComponent} from './task-report/task-report.component';
import {TaskWindowComponent} from './task-window/task-window.component';
import {TaskCurrentComponent} from './task-current/task-current.component';
import {TaskCalendarComponent} from './task-calendar/task-calendar.component';
import {TaskActivityComponent} from './task-activity/task-activity.component';
import {TaskBottomSheetComponent} from './task-bottom-sheet/task-bottom-sheet.component';
import {TaskCalendarRateComponent} from './task-calendar/task-calendar-rate/task-calendar-rate.component';
import {TaskCalendarFilterComponent} from './task-calendar/task-calendar-filter/task-calendar-filter.component';
import {TaskCalendarWeekdayComponent} from './task-calendar/task-calendar-weekday/task-calendar-weekday.component';

@NgModule({
  declarations: [
    TaskAddComponent,
    TaskStopComponent,
    TaskMainComponent,
    TaskFormComponent,
    TaskTodoComponent,
    TaskBoardComponent,
    TaskDetailComponent,
    TaskFilterComponent,
    TaskReportComponent,
    TaskWindowComponent,
    TaskCurrentComponent,
    TaskCalendarComponent,
    TaskActivityComponent,
    TaskBottomSheetComponent,
    TaskCalendarRateComponent,
    TaskCalendarFilterComponent,
    TaskCalendarWeekdayComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    FullCalendarModule,
    TranslateModule.forChild({})
  ]
})
export class TasksModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<TaskWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(TaskWindowComponent);
  }
}
