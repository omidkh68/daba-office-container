import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {PageNotFoundComponent} from './components/';
import {JalaliPipe} from '../pipes/jalali.pipe';
import {TimeAreaDigitalClockComponent} from "../components/dashboard/dashboard-toolbar/time-area/time-area-digital-clock/time-area-digital-clock.component";

@NgModule({
  declarations: [PageNotFoundComponent, JalaliPipe ,TimeAreaDigitalClockComponent],
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule],
  exports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule, JalaliPipe , TimeAreaDigitalClockComponent]
})
export class SharedModule {
}
