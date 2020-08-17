import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {WebBrowserMainComponent} from './web-browser-main/web-browser-main.component';
import {WebBrowserWindowComponent} from './web-browser-window/web-browser-window.component';

@NgModule({
  declarations: [
    WebBrowserMainComponent,
    WebBrowserWindowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild({}),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WebBrowserModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<WebBrowserWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(WebBrowserWindowComponent);
  }
}
