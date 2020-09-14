import {Component, ElementRef, Injector, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AppConfig} from '../../../../environments/environment';
import {Subscription} from 'rxjs/internal/Subscription';
import {WebViewService} from '../service/web-view.service';
import {MessageService} from '../../message/service/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {ElectronService} from '../../../services/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {ConferenceInterface} from '../logic/conference.interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ConferenceAddComponent} from '../conference-add/conference-add.component';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-conference-main',
  templateUrl: './conference-main.component.html',
  styleUrls: ['./conference-main.component.scss']
})
export class ConferenceMainComponent extends LoginDataClass implements OnDestroy {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'videoConference'};
  showConference: boolean = false;
  confAddress: string = '';
  reloadWebView: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private messageService: MessageService,
              private webViewService: WebViewService,
              private userInfoService: UserInfoService,
              private electronService: ElectronService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
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
          try {
            this.webFrame.nativeElement.reloadIgnoringCache();
          } catch (e) {}
        }
      })
    );
  }

  addNewVideoConf() {
    const dialogRef = this.dialog.open(ConferenceAddComponent, {
      autoFocus: false,
      width: '350px',
      height: '280px',
      data: {action: 'add'}
    });

    this.windowManagerService.dialogOnTop(dialogRef.id);

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: ConferenceInterface) => {
        if (resp) {
          this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'videoConference'});

          this.confAddress = resp.confname;

          const address = `${AppConfig.CONF_URL}?username=${resp.username}&confname=${resp.confname}&lang=${this.rtlDirection ? 'fa' : 'en'}&mode=${this.loggedInUser.dark_mode}`;

          if (this.webFrame) {
            this.webFrame.nativeElement.setAttribute('src', address);

            this.webFrame.nativeElement.addEventListener('did-start-loading', () => {

              this.electronService.remote.webContents.fromId(this.webFrame.nativeElement.getWebContentsId()).session.clearCache();

              this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'videoConference'});
            });

            this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'videoConference'});
            });

            setTimeout(() => this.showConference = true);
          }
        }
      })
    );
  }

  copyInClipBoard() {
    const message = this.getTranslate('conference.added_to_clipboard');
    this.messageService.showMessage(message)
  }

  exitOfConference() {
    this.webFrame.nativeElement.setAttribute('src', '');
    this.webFrame.nativeElement.stop();

    this.showConference = false;
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
