import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AppConfig} from '../../../../environments/environment';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {ConferenceInterface} from '../logic/conference.interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ConferenceAddComponent} from '../conference-add/conference-add.component';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {WindowManagerService} from '../../../services/window-manager.service';

@Component({
  selector: 'app-conference-main',
  templateUrl: './conference-main.component.html',
  styleUrls: ['./conference-main.component.scss']
})
export class ConferenceMainComponent implements OnDestroy {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'videoConference'};
  showConference: boolean = false;
  confAddress: string = '';

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private messageService: MessageService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
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

          const address = `${AppConfig.CONF_URL}?username=${resp.username}&confname=${resp.confname}`;

          if (this.webFrame) {
            this.webFrame.nativeElement.setAttribute('src', address);

            this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
              // console.log('did-start-loading');
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
