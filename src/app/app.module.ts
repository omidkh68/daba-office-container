import 'reflect-metadata';
import '../polyfills';

import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppRoutingModule} from './app-routing.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {HomeModule} from './home/home.module';
import {SharedModule} from './shared/shared.module';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {MessageComponent} from './components/message/message.component';
import {ApproveComponent} from './components/approve/approve.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MessageComponent,
    ApproveComponent
  ],
  imports: [
    HomeModule,
    CommonModule,
    SharedModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {provide: 'windowObject', useValue: window},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
