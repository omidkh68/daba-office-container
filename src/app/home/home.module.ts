import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {SidebarComponent} from '../template/sidebar/sidebar.component';
import {NbLayoutModule, NbWindowModule} from '@nebular/theme';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NbLayoutModule,
    NbWindowModule.forChild({
      title: ''
    }),
    HomeRoutingModule,
    BrowserAnimationsModule
  ]
})
export class HomeModule {
}
