import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {DashboardComponent} from './dashboard.component';
import {ChangeStatusComponent} from '../status/change-status/change-status.component';
import {NbLayoutModule, NbWindowModule} from '@nebular/theme';
import {ScreenshotComponent} from '../screenshot/screenshot.component';
// import {SocketioService} from '../../services/socketio.service';

@NgModule({
  declarations: [
    DashboardComponent,
    ChangeStatusComponent,
    ScreenshotComponent
  ],
  imports: [
    SharedModule,
    TranslateModule.forChild({}),
    NbLayoutModule,
    NbWindowModule.forChild({
      title: ''
    }),
    RouterModule.forChild([
      {path: '', component: DashboardComponent},
    ])
  ],
  // providers: [SocketioService],
  exports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
}
