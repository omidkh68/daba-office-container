import {AfterViewInit, Component, Inject, Injector, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../../services/loginData.class';
import {UserInfoService} from '../../../users/services/user-info.service';
import {ElectronService} from '../../../../services/electron.service';
import {SoftPhoneService} from '../../../soft-phone/service/soft-phone.service';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {ProfileSettingComponent} from '../../../profile-setting/profile-setting.component';
import {UserContainerInterface} from "../../../users/logic/user-container.interface";
import {EventHandlerService} from "../../../events/service/event-handler.service";
import {EventHandlerInterface, EventsReminderInterface} from "../../../events/logic/event-handler.interface";
import * as moment from "moment";

@Component({
  selector: 'app-notification-area',
  styleUrls: ['./notification-area.component.scss'],
  templateUrl: './notification-area.component.html'
})

export class NotificationAreaComponent extends LoginDataClass implements OnDestroy, AfterViewInit {
  arrayItem: EventHandlerInterface[] = []
  test;
  @Input()
  rtlDirection: boolean;
  @Input()
  loggedInUser: UserContainerInterface;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject('windowObject') private window,
              public dialog: MatDialog,
              private router: Router,
              private api: ApiService,
              private injector: Injector,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private eventHandlerService: EventHandlerService,
              private windowManagerService: WindowManagerService) {
    super(injector, userInfoService);
  }

  ngAfterViewInit() {
    this._subscription.add(
      this.eventHandlerService.currentEventsReminderList.subscribe((test: EventsReminderInterface) => {
        if (test) {
          this.test = test.events;
          test.events.map(item => {
            let cdate = new Date();
            let date = moment(cdate).subtract(1, 'days').format('YYYY-MM-DD, h:mm:ss')
            if (new Date(item.startDate) >= new Date(date)) {
              this.arrayItem.push(item)
            }
          })
          this.eventHandlerService.moveEvents(this.arrayItem);
        }
      })
    );
  }

  logout() {
    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.logout().subscribe((resp: any) => {
        if (resp.success) {
          this.clearData();
        }
      }, () => {
        this.clearData();
      })
    );
  }
  clearData() {
    this.userInfoService.changeLoginData(null);

    this.softPhoneService.sipHangUp();

    this.windowManagerService.closeAllServices().then(() => {
      setTimeout(() => this.router.navigateByUrl(`/login`), 500);
    });
  }
  showProfileSetting() {
    const dialogRef = this.dialog.open(ProfileSettingComponent, {
      autoFocus: false,
      width: '480px',
      height: '565px',
      panelClass: 'status-dialog'
    });

    this.windowManagerService.dialogOnTop(dialogRef.id);
  }
  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
