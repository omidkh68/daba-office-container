import {ComponentFactory, ComponentFactoryResolver, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {ConferencesCollaborationComponent} from './conferences-collaboration.component';
import {ConferencesCollaborationMainComponent} from './conferences-collaboration-main/conferences-collaboration-main.component';
import {ConferencesCollaborationWindowComponent} from './conferences-collaboration-window/conferences-collaboration-window.component';

@NgModule({
  declarations: [
    ConferencesCollaborationComponent,
    ConferencesCollaborationMainComponent,
    ConferencesCollaborationWindowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild()
  ]
})
export class ConferencesCollaborationModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<ConferencesCollaborationWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(ConferencesCollaborationWindowComponent);
  }
}
