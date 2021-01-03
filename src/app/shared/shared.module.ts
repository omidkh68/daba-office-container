import {NgModule} from '@angular/core';
import {JalaliPipe} from '../pipes/jalali.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {WebviewDirective} from './directives';
import {PageNotFoundComponent} from './components/';
import {TimeAreaDigitalClockComponent} from '../components/dashboard/dashboard-toolbar/time-area/time-area-digital-clock/time-area-digital-clock.component';
import {ImagePreloadDirective} from '../directives/ImagePreloadDirective';
import {EventsHandlerCalendarComponent} from "../components/events/event-handler-calendar/events-handler-calendar.component";
import {DpDatePickerModule} from "ng2-jalali-date-picker";
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [EventsHandlerCalendarComponent, ImagePreloadDirective, JalaliPipe, PageNotFoundComponent, TimeAreaDigitalClockComponent, WebviewDirective],
  imports: [CommonModule, DpDatePickerModule, TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule, DpDatePickerModule],
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
