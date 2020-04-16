import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatCoreModule} from './mat-core.module';
import {TranslateModule} from '@ngx-translate/core';
import {PageNotFoundComponent} from './components/';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule],
  exports: [TranslateModule, FormsModule, ReactiveFormsModule, MatCoreModule]
})
export class SharedModule {
}
