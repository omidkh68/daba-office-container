import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    BrowserAnimationsModule
  ]
})
export class HomeModule {
}
