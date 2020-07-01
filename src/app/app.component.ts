import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MessageService} from './services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {ViewDirectionService} from './services/view-direction.service';

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

  constructor(
    private messageService: MessageService,
    private translate: TranslateService,
    private viewDirection: ViewDirectionService
  ) {
    translate.setDefaultLang('fa');

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
        this.messageService.showMessage(this.getTranslate('global.online'));
      })
    );

    this._subscription.add(
      this.offlineEvent.subscribe(e => {
        this.showConnectionOverlay = true;

        this.messageService.durationInSeconds = 0;
        this.messageService.showMessage(this.getTranslate('global.offline'));
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
