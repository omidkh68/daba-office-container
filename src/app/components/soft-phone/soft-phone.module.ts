import {ComponentFactory, ComponentFactoryResolver, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {digitalOnlyDirective} from '../../directives/digital-only.directive';
import {SoftPhoneMainComponent} from './soft-phone-main/soft-phone-main.component';
import {SoftPhoneLogsComponent} from './soft-phone-logs/soft-phone-logs.component';
import {SoftPhoneWindowComponent} from './soft-phone-window/soft-phone-window.component';
import {SoftPhoneKeypadComponent} from './soft-phone-keypad/soft-phone-keypad.component';
import {SoftPhoneSettingsComponent} from './soft-phone-settings/soft-phone-settings.component';
import {SoftPhoneContactsComponent} from './soft-phone-contacts/soft-phone-contacts.component';
import {SoftPhoneCallPopUpComponent} from './soft-phone-call-pop-up/soft-phone-call-pop-up.component';
import {SoftPhoneBottomSheetComponent} from './soft-phone-bottom-sheet/soft-phone-bottom-sheet.component';
import {SoftPhoneCallToActionComponent} from './soft-phone-call-to-action/soft-phone-call-to-action.component';
import {SoftPhoneContactDetailComponent} from './soft-phone-contacts/soft-phone-contact-detail/soft-phone-contact-detail.component';
import {SoftPhoneTransferCallComponent} from './soft-phone-transfer-call/soft-phone-transfer-call.component';
import {MyFilterPipe, SoftPhoneInformationComponent} from './soft-phone-information/soft-phone-information.component';

@NgModule({
  declarations: [
    MyFilterPipe,
    digitalOnlyDirective,
    SoftPhoneMainComponent,
    SoftPhoneLogsComponent,
    SoftPhoneKeypadComponent,
    SoftPhoneWindowComponent,
    SoftPhoneSettingsComponent,
    SoftPhoneContactsComponent,
    SoftPhoneCallPopUpComponent,
    SoftPhoneBottomSheetComponent,
    SoftPhoneInformationComponent,
    SoftPhoneCallToActionComponent,
    SoftPhoneTransferCallComponent,
    SoftPhoneContactDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild({}),
  ]
})
export class SoftPhoneModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<SoftPhoneWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(SoftPhoneWindowComponent);
  }
}
