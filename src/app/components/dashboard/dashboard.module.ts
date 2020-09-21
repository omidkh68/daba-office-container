import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DndDirective} from '../profile-setting/dnd.directive';
import {PopoverModule} from '../popover-widget/popover.module';
import {TranslateModule} from '@ngx-translate/core';
import {ProgressComponent} from '../profile-setting/progress/progress.component';
import {TimeAreaComponent} from './dashboard-toolbar/time-area/time-area.component';
import {MainMenuComponent} from './dashboard-toolbar/main-menu/main-menu.component';
import {DashboardComponent} from './dashboard.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {WallpaperComponent} from '../profile-setting/wallpaper/wallpaper.component';
import {ScreenshotComponent} from '../screenshot/screenshot.component';
import {UserStatusComponent} from './dashboard-toolbar/user-status/user-status.component';
import {ProfileMenuComponent} from './dashboard-toolbar/profile-menu/profile-menu.component';
import {ChangeStatusComponent} from '../status/change-status/change-status.component';
import {TimeAreaClockComponent} from './dashboard-toolbar/time-area/time-area-clock/time-area-clock.component';
import {PopoverContnetComponent} from '../popover-widget/popover/popover-content/popover-content.component';
import {ProfileSettingComponent} from '../profile-setting/profile-setting.component';
import {DashboardToolbarComponent} from './dashboard-toolbar/dashboard-toolbar.component';
import {ShowImageCropperComponent} from '../profile-setting/show-image-cropper/show-image-cropper.component';
import {WindowAppContainerComponent} from './dashboard-toolbar/window-app-container/window-app-container.component';
import {DashboardDatepickerComponent} from './dashboard-datepicker/dashboard-datepicker.component';
import {SoftPhoneIncomingCallComponent} from '../soft-phone/soft-phone-incoming-call/soft-phone-incoming-call.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {JalaliMomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '../../shared/jalali-moment-date-adapter';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {JALALI_MOMENT_FORMATS, MOMENT_FORMATS} from '../../shared/jalali_moment_formats';
import {JalaliPipe} from "../../pipes/jalali.pipe";
import {DatetimeService} from "./dashboard-toolbar/time-area/service/datetime.service";

const defaultLangStorage = localStorage.getItem('defaultLang');
const defaultLang = defaultLangStorage !== null && defaultLangStorage === 'fa' ? 'fa' : 'en-GB';

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
    PopoverContnetComponent,
    DashboardToolbarComponent,
    ShowImageCropperComponent,
    WindowAppContainerComponent,
    DashboardDatepickerComponent,
    SoftPhoneIncomingCallComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PopoverModule,
    ImageCropperModule,
    RouterModule.forChild([
      {path: '', component: DashboardComponent},
    ]),
    TranslateModule.forChild()
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: defaultLang === 'fa' ? JalaliMomentDateAdapter : MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {provide: MAT_DATE_LOCALE, useValue: defaultLang === 'fa' ? defaultLang : 'en-GB'}, // en-GB  fr
    {
      provide: MAT_DATE_FORMATS,
      useFactory: locale => {
        if (locale === (defaultLang === 'fa')) {
          return JALALI_MOMENT_FORMATS;
        } else {
          return MOMENT_FORMATS;
        }
      },
      deps: [MAT_DATE_LOCALE],
      // useValue: JALALI_MOMENT_FORMATS
    },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  entryComponents: [PopoverContnetComponent]
})
export class DashboardModule {
}
