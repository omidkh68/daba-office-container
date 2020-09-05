import {AfterViewInit, Component, ElementRef, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-web-browser-main',
  templateUrl: './web-browser-main.component.html',
  styleUrls: ['./web-browser-main.component.scss']
})
export class WebBrowserMainComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  rtlDirection: boolean;
  currentUrl = 'https://www.google.com';
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'videoConference'};

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private viewDirection: ViewDirectionService,
              private translateService: TranslateService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngAfterViewInit(): void {
    if (this.webFrame) {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'adminPanel'});

      this.webFrame.nativeElement.setAttribute('src', 'https://www.google.com');

      this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'adminPanel'});
      });
    }
  }

  enterAddress($event) {
    this.currentUrl = $event.target.value;

    if ($event.key === 'Enter') {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'adminPanel'});

      this.webFrame.nativeElement.setAttribute('src', `${this.currentUrl}`);
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
