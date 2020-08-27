import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {AdminPanelMainComponent} from './admin-panel-main/admin-panel-main.component';
import {AdminPanelWindowComponent} from './admin-panel-window/admin-panel-window.component';

@NgModule({
  declarations: [
    AdminPanelMainComponent,
    AdminPanelWindowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild({}),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminPanelModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<AdminPanelWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(AdminPanelWindowComponent);
  }
}
