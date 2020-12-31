import {NgModule} from '@angular/core';
import {JalaliPipe} from '../pipes/jalali.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {WebviewDirective} from './directives';
import {PageNotFoundComponent} from './components/';
import {TimeAreaDigitalClockComponent} from '../components/dashboard/dashboard-toolbar/time-area/time-area-digital-clock/time-area-digital-clock.component';
import {ImagePreloadDirective} from '../directives/ImagePreloadDirective';

@NgModule({
  declarations: [ImagePreloadDirective, JalaliPipe, PageNotFoundComponent, TimeAreaDigitalClockComponent, WebviewDirective],
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule],
  exports: [
    JalaliPipe,
    FormsModule,
    MatCoreModule,
    TranslateModule,
    WebviewDirective,
    ReactiveFormsModule,
    ImagePreloadDirective,
    TimeAreaDigitalClockComponent
  ]
})
export class SharedModule {
}
