import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {LearningSystemMainComponent} from './learning-system-main/learning-system-main.component';
import {LearningSystemWindowComponent} from './learning-system-window/learning-system-window.component';

@NgModule({
  declarations: [
    LearningSystemMainComponent,
    LearningSystemWindowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild({}),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LearningSystemModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<LearningSystemWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(LearningSystemWindowComponent);
  }
}
