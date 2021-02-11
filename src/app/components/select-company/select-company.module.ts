import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {SelectCompanyComponent} from './select-company.component';

@NgModule({
  declarations: [
    SelectCompanyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: SelectCompanyComponent},
    ]),
    TranslateModule.forChild()
  ]
})
export class SelectCompanyModule {
}
