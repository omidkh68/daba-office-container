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
import {MomentDateAdapter} from '@angular/material-moment-adapter';
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
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {JalaliMomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '../../shared/jalali-moment-date-adapter';
import {JALALI_MOMENT_FORMATS, MOMENT_FORMATS} from '../../shared/jalali_moment_formats';
import {TaskReportDescriptionComponent} from './task-description/task-report-description.component';
// import {DpDatePickerModule} from 'ng2-jalali-date-picker';

const defaultLangStorage = localStorage.getItem('defaultLang');
const defaultLang = defaultLangStorage !== null && defaultLangStorage === 'fa' ? 'fa' : 'en-GB';

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
    TaskCalendarWeekdayComponent,
    TaskReportDescriptionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    // DpDatePickerModule,
    FullCalendarModule,
    TranslateModule.forChild()
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: defaultLang === 'fa' ? JalaliMomentDateAdapter : MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {provide: MAT_DATE_LOCALE, useValue: defaultLang === 'fa' ? defaultLang : 'en-GB'}, // en-GB  fr
    {
      provide: MAT_DATE_FORMATS,
      useFactory: locale => {
        if (locale === (defaultLang === 'fa')) {
          return JALALI_MOMENT_FORMATS;
        } else {
          return MOMENT_FORMATS;
        }
      },
      deps: [MAT_DATE_LOCALE],
      // useValue: JALALI_MOMENT_FORMATS
    },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})
export class TasksModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<TaskWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(TaskWindowComponent);
  }
}
