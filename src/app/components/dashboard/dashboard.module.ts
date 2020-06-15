import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MainMenuComponent} from './dashboard-toolbar/main-menu/main-menu.component';
import {DashboardComponent} from './dashboard.component';
import {ScreenshotComponent} from '../screenshot/screenshot.component';
import {ProfileMenuComponent} from './dashboard-toolbar/profile-menu/profile-menu.component';
import {ChangeStatusComponent} from '../status/change-status/change-status.component';
import {DashboardToolbarComponent} from './dashboard-toolbar/dashboard-toolbar.component';
import {TimeAreaComponent} from './dashboard-toolbar/time-area/time-area.component';
import {WindowAppContainerComponent} from './dashboard-toolbar/window-app-container/window-app-container.component';
import {UserStatusComponent} from './dashboard-toolbar/user-status/user-status.component';

@NgModule({
  declarations: [
    MainMenuComponent,
    TimeAreaComponent,
    DashboardComponent,
    UserStatusComponent,
    ScreenshotComponent,
    ProfileMenuComponent,
    ChangeStatusComponent,
    DashboardToolbarComponent,
    WindowAppContainerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: DashboardComponent},
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
}
