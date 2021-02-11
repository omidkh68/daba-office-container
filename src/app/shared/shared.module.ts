import {NgModule} from '@angular/core';
import {JalaliPipe} from '../pipes/jalali.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {WebviewDirective} from './directives';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {PageNotFoundComponent} from './components/';
import {ImagePreloadDirective} from '../directives/ImagePreloadDirective';
import {TimeAreaDigitalClockComponent} from '../components/dashboard/dashboard-toolbar/time-area/time-area-digital-clock/time-area-digital-clock.component';
import {EventsHandlerCalendarComponent} from '../components/events/event-handler-calendar/events-handler-calendar.component';

@NgModule({
  declarations: [
    JalaliPipe,
    WebviewDirective,
    ImagePreloadDirective,
    PageNotFoundComponent,
    TimeAreaDigitalClockComponent,
    EventsHandlerCalendarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatCoreModule,
    TranslateModule,
    DpDatePickerModule,
    DpDatePickerModule,
    ReactiveFormsModule
  ],
  exports: [
    JalaliPipe,
    FormsModule,
    MatCoreModule,
    TranslateModule,
    WebviewDirective,
    ReactiveFormsModule,
    ImagePreloadDirective,
    TimeAreaDigitalClockComponent,
    EventsHandlerCalendarComponent
  ]
})
export class SharedModule {
}
