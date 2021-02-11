import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ConferenceAddComponent} from './conference-add/conference-add.component';
import {ConferenceMainComponent} from './conference-main/conference-main.component';
import {ConferenceWindowComponent} from './conference-window/conference-window.component';

@NgModule({
  declarations: [
    ConferenceAddComponent,
    ConferenceMainComponent,
    ConferenceWindowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild({}),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConferenceModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<ConferenceWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(ConferenceWindowComponent);
  }
}
