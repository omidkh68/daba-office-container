import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {PageNotFoundComponent} from './components/';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule],
  exports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule]
})
export class SharedModule {
}
