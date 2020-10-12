import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AppConfig} from '../../../../environments/environment';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {WebViewService} from '../service/web-view.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-admin-panel-main',
  templateUrl: './admin-panel-main.component.html',
  styleUrls: ['./admin-panel-main.component.scss']
})
export class AdminPanelMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = null;
  reloadWebView: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private webViewService: WebViewService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.webViewService.currentRefreshWebView.subscribe(status => {
        this.reloadWebView = status;

        if (this.reloadWebView && this.webFrame) {
          this.webFrame.nativeElement.reloadIgnoringCache();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.webFrame) {
      const address = `${AppConfig.ADMIN_URL}/#/home/?tokenType=${this.loginData.token_type}&accessToken=${this.loginData.access_token}`;

      this.webFrame.nativeElement.setAttribute('src', address);

      this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
       // this.electronService.remote.webContents.fromId(this.webFrame.nativeElement.getWebContentsId()).session.clearCache();

        this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'adminPanel'});
      });

      this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'adminPanel'});
      });
    }
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
