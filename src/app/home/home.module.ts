import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {SidebarComponent} from '../template/sidebar/sidebar.component';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    BrowserAnimationsModule
  ]
})
export class HomeModule {
}
