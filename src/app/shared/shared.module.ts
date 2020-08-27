import {NgModule} from '@angular/core';
import {JalaliPipe} from '../pipes/jalali.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {WebviewDirective} from './directives';
import {PageNotFoundComponent} from './components/';
import {TimeAreaDigitalClockComponent} from '../components/dashboard/dashboard-toolbar/time-area/time-area-digital-clock/time-area-digital-clock.component';

@NgModule({
  declarations: [PageNotFoundComponent, JalaliPipe, TimeAreaDigitalClockComponent, WebviewDirective],
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule],
  exports: [
    JalaliPipe,
    FormsModule,
    MatCoreModule,
    TranslateModule,
    WebviewDirective,
    ReactiveFormsModule,
    TimeAreaDigitalClockComponent
  ]
})
export class SharedModule {
}
