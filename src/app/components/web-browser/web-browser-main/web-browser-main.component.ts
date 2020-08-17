import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-web-browser-main',
  templateUrl: './web-browser-main.component.html',
  styleUrls: ['./web-browser-main.component.scss']
})
export class WebBrowserMainComponent implements OnDestroy {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'videoConference'};

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService,
              private messageService: MessageService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
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
