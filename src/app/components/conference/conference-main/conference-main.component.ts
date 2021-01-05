import {Component, ElementRef, Injector, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AppConfig} from '../../../../environments/environment';
import {Subscription} from 'rxjs/internal/Subscription';
import {WebViewService} from '../service/web-view.service';
import {MessageService} from '../../message/service/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {ElectronService} from '../../../core/services';
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
  showFrame: boolean = false;
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
          if (this.isElectron) {
            this.webFrame.nativeElement.reloadIgnoringCache();
          } else {
            const src = this.webFrame.nativeElement.getAttribute('src');

            this.webFrame.nativeElement.setAttribute('src', '');

            const rndTime = Date.now();

            setTimeout(() => {
              this.webFrame.nativeElement.setAttribute('src', src + '&var=' + rndTime);
            }, 500);
          }
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

          const rndTime = Date.now();

          const address = `${AppConfig.CONF_URL}?username=${resp.username}&confname=${resp.confname}&lang=${this.rtlDirection ? 'fa' : 'en'}&darkMode=${this.loggedInUser.dark_mode}&var=${rndTime}`;

          this.webFrame.nativeElement.setAttribute('src', address);

          if (this.isElectron) {
            this.webFrame.nativeElement.addEventListener('did-start-loading', () => {

              this.electronService.remote.webContents.fromId(this.webFrame.nativeElement.getWebContentsId()).session.clearCache();

              this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'videoConference'});
            });

            this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'videoConference'});
            });
          } else {
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'videoConference'});
          }

          setTimeout(() => this.showFrame = true);
        }
      })
    );
  }

  get isElectron() {
    return this.electronService.isElectron;
  }

  copyInClipBoard() {
    const message = this.getTranslate('conference.added_to_clipboard');
    this.messageService.showMessage(message)
  }

  exitOfConference() {
    this.webFrame.nativeElement.setAttribute('src', '');

    if (this.isElectron) {
      this.webFrame.nativeElement.stop();
    }

    this.showFrame = false;
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
