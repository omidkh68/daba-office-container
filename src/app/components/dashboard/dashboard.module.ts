import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TimeAreaComponent} from './dashboard-toolbar/time-area/time-area.component';
import {TimeAreaClockComponent} from './dashboard-toolbar/time-area/time-area-clock/time-area-clock.component';
import {MainMenuComponent} from './dashboard-toolbar/main-menu/main-menu.component';
import {DashboardComponent} from './dashboard.component';
import {ScreenshotComponent} from '../screenshot/screenshot.component';
import {UserStatusComponent} from './dashboard-toolbar/user-status/user-status.component';
import {ProfileMenuComponent} from './dashboard-toolbar/profile-menu/profile-menu.component';
import {ChangeStatusComponent} from '../status/change-status/change-status.component';
import {DashboardToolbarComponent} from './dashboard-toolbar/dashboard-toolbar.component';
import {WindowAppContainerComponent} from './dashboard-toolbar/window-app-container/window-app-container.component';
import {SoftPhoneIncomingCallComponent} from '../soft-phone/soft-phone-incoming-call/soft-phone-incoming-call.component';
import {A11yModule} from "@angular/cdk/a11y";
import {ProfileWallpaperComponent} from "../profile-setting/profile-wallpaper/profile-wallpaper.component";
import {ProfileInformationComponent} from "../profile-setting/profile-information/profile-information.component";
import {ProfileSettingComponent} from "../profile-setting/profile-setting.component";
/*import {ImageCropperModule} from "../profile-setting/image-cropper.module";*/
import {ImageCropperModule} from "ngx-image-cropper";
import {ShowImageCropperComponent} from "../profile-setting/show-image-cropper/show-image-cropper.component";
import {WallpaperComponent} from "../profile-setting/wallpaper/wallpaper.component";
import {DndDirective} from "../profile-setting/dnd.directive";
import {ProgressComponent} from "../profile-setting/progress/progress.component";
import {DatetimeService} from "../profile-setting/logic/datetime.service";


@NgModule({
  declarations: [
    DndDirective,
    DatetimeService,
    ProgressComponent,
    MainMenuComponent,
    TimeAreaComponent,
    DashboardComponent,
    WallpaperComponent,
    UserStatusComponent,
    ScreenshotComponent,
    ProfileMenuComponent,
    ChangeStatusComponent,
    TimeAreaClockComponent,
    ProfileSettingComponent,
    DashboardToolbarComponent,
    ProfileWallpaperComponent,
    ShowImageCropperComponent,
    WindowAppContainerComponent,
    ProfileInformationComponent,
    SoftPhoneIncomingCallComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: DashboardComponent},
    ]),
    A11yModule,
    ImageCropperModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
}
