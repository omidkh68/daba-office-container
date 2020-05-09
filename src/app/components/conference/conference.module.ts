import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NbLayoutModule, NbWindowModule, NbWindowState} from '@nebular/theme';
import {ConferenceMainComponent} from './conference-main/conference-main.component';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    NbLayoutModule,
    NbWindowModule.forChild({
      title: '',
      initialState: NbWindowState.FULL_SCREEN
    }),
    TranslateModule.forChild({}),
  ],
  exports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConferenceModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<ConferenceMainComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(ConferenceMainComponent);
  }
}
