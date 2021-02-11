import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {timer} from 'rxjs';

@Component({
  selector: 'app-time-area-digital-clock',
  templateUrl: './time-area-digital-clock.component.html'
})
export class TimeAreaDigitalClockComponent implements OnChanges, OnDestroy {
  @Input()
  timezone: string;

  timerDueTime = 0;
  timerPeriod = 1000;
  time: string;
  globalTimer = null;
  globalTimerSubscription: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timezone.firstChange) {
      this.globalTimer = timer(
        this.timerDueTime, this.timerPeriod
      );

      this.globalTimerSubscription = this.globalTimer.subscribe(() => this.getTime());
    }
  }

  getTime(): void {
    this.time = new Date().toLocaleTimeString('en-US', {
      timeZone: this.timezone && this.timezone.length ? this.timezone : 'UTC',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ngOnDestroy(): void {
    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
      this.globalTimer = null;
    }
  }
}
