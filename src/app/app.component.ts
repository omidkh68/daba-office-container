import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {fromEvent} from 'rxjs';
import {ApiService} from './components/users/logic/api.service';
import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from './components/message/service/message.service';
import {UserInfoService} from './components/users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {CheckLoginInterface} from './components/login/logic/check-login.interface';
import {RefreshLoginService} from './components/login/services/refresh-login.service';
import {ChangeStatusService} from './components/status/services/change-status.service';
import {ViewDirectionService} from './services/view-direction.service';
import {CompanySelectorService} from './components/select-company/services/company-selector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  rtlDirection: boolean;
  showConnectionOverlay: boolean = false;
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;

  private _subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private apiService: ApiService,
              private translate: TranslateService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private changeStatusService: ChangeStatusService,
              private companySelectorService: CompanySelectorService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngAfterViewInit(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this._subscription.add(
      this.onlineEvent.subscribe(e => {
        this.showConnectionOverlay = false;
        this.messageService.showMessage(this.getTranslate('global.online'), '', 5);

        this._subscription.add(
          this.apiService.checkLogin().subscribe((resp: CheckLoginInterface) => {
            this.userInfoService.changeUserInfo(resp.data);

            this.viewDirection.changeDirection(resp.data.lang === 'fa');

            this.changeStatusService.changeUserStatus(resp.data.user_status);

            this.companySelectorService.changeCompanyList(resp.data.companies);
          }, (error: HttpErrorResponse) => {
            this.refreshLoginService.openLoginDialog(error);
          })
        );
      })
    );

    this._subscription.add(
      this.offlineEvent.subscribe(e => {
        this.showConnectionOverlay = true;

        this.messageService.durationInSeconds = 0;
        this.messageService.showMessage(this.getTranslate('global.offline'), '', 5);
      })
    );
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
