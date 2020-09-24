import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MessageService} from './components/message/service/message.service';
import {TranslateService} from '@ngx-translate/core';
import {fromEvent} from 'rxjs';
import {Subscription} from 'rxjs/internal/Subscription';
import {Observable} from 'rxjs/internal/Observable';
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

  constructor(private translate: TranslateService,
              private messageService: MessageService,
              private viewDirection: ViewDirectionService) {
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
