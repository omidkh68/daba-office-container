import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from './services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {fromEvent, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showConnectionOverlay: boolean = false;
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;

  private _subscription: Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('fa');
  }

  ngOnInit(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this._subscription.add(
      this.onlineEvent.subscribe(e => {
        this.showConnectionOverlay = false;
        this.messageService.showMessage('You are now online');
      })
    );

    this._subscription.add(
      this.offlineEvent.subscribe(e => {
        this.showConnectionOverlay = true;

        this.messageService.durationInSeconds = 0;
        this.messageService.showMessage('Connection lost! You are not connected to internet');
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
