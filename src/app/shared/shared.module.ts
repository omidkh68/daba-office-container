import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {PageNotFoundComponent} from './components/';
import {JalaliPipe} from '../pipes/jalali.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, JalaliPipe],
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule],
  exports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule, JalaliPipe]
})
export class SharedModule {
}
