import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {ConferenceInterface} from '../logic/conference.interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ConferenceAddComponent} from '../conference-add/conference-add.component';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-conference-main',
  templateUrl: './conference-main.component.html',
  styleUrls: ['./conference-main.component.scss']
})
export class ConferenceMainComponent implements OnDestroy {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  rtlDirection: boolean;
  loadingIndicator: boolean = false;
  showConference: boolean = false;
  confAddress: string = '';

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService,
              private messageService: MessageService) {
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

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: ConferenceInterface) => {
        if (resp) {
          this.loadingIndicatorService.changeLoadingStatus(true);

          this.confAddress = `https://conference.dabacenter.ir/main.php?username=${resp.username}&confname=${resp.confname}`;

          this.webFrame.nativeElement.setAttribute('src', this.confAddress);

          this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
            // console.log('did-start-loading');
          });

          this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
            this.loadingIndicatorService.changeLoadingStatus(false);
          });

          setTimeout(() => {
            this.showConference = true;
          });
        }
      })
    );
  }

  joinToExistConf() {
    const dialogRef = this.dialog.open(ConferenceAddComponent, {
      autoFocus: false,
      width: '350px',
      height: '205px',
      data: {action: 'join'}
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: ConferenceInterface) => {
        if (resp) {
          this.loadingIndicatorService.changeLoadingStatus(true);

          this.confAddress = resp.confAddress;

          this.webFrame.nativeElement.setAttribute('src', this.confAddress);

          this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
            // console.log('did-start-loading');
          });

          this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
            // console.log('did-stop-loading');
            this.loadingIndicatorService.changeLoadingStatus(false);
          });

          setTimeout(() => {
            this.showConference = true;
          });
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
