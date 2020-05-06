import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {SidebarComponent} from '../template/sidebar/sidebar.component';
import {NbLayoutModule, NbWindowModule} from '@nebular/theme';
import {TaskMessagesComponent} from '../components/tasks/task-messages/task-messages.component';
import {TaskMainComponent} from '../components/tasks/task-main/task-main.component';

@NgModule({
  declarations: [
    HomeComponent,
    TaskMessagesComponent,
    SidebarComponent,
    DashboardComponent,
    TaskMainComponent
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
  ],
  entryComponents: [TaskMessagesComponent]
})
export class HomeModule {
}
