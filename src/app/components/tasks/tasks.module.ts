import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TaskAddComponent} from './task-add/task-add.component';
import {TaskMainComponent} from './task-main/task-main.component';
import {TaskStopComponent} from './task-stop/task-stop.component';
import {TaskTodoComponent} from './task-todo/task-todo.component';
import {TaskFormComponent} from './task-form/task-form.component';
import {MyFilterPipe, TaskBoardComponent} from './task-board/task-board.component';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {TaskFilterComponent} from './task-filter/task-filter.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskReportComponent} from './task-report/task-report.component';
import {TaskWindowComponent} from './task-window/task-window.component';
import {TaskCurrentComponent} from './task-current/task-current.component';
import {TaskCalendarComponent} from './task-calendar/task-calendar.component';
import {TaskActivityComponent} from './task-activity/task-activity.component';
import {TaskMoreListComponent} from './task-morelist/task-morelist.component';
import {TaskBottomSheetComponent} from './task-bottom-sheet/task-bottom-sheet.component';
import {TaskCalendarRateComponent} from './task-calendar/task-calendar-rate/task-calendar-rate.component';
import {TaskCalendarFilterComponent} from './task-calendar/task-calendar-filter/task-calendar-filter.component';
import {TaskCalendarWeekdayComponent} from './task-calendar/task-calendar-weekday/task-calendar-weekday.component';
import {TaskReportDescriptionComponent} from './task-description/task-report-description.component';

@NgModule({
  declarations: [
    MyFilterPipe,
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
    TaskMoreListComponent,
    TaskActivityComponent,
    TaskBottomSheetComponent,
    TaskCalendarRateComponent,
    TaskCalendarFilterComponent,
    TaskCalendarWeekdayComponent,
    TaskReportDescriptionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    DpDatePickerModule,
    TranslateModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TasksModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<TaskWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(TaskWindowComponent);
  }
}
