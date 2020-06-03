import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import * as jalaliMoment from 'jalali-moment';
import {ViewDirectionService} from '../services/view-direction.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Pipe({
  name: 'jalali'
})
export class JalaliPipe implements PipeTransform, OnDestroy {
  rtlDirection: boolean;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  transform(value: string, ...args: unknown[]): string {
    if (this.viewDirection) {
      if (jalaliMoment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') === value) {
        return jalaliMoment(value, 'YYYY-MM-DD HH:mm:ss').locale('fa').format('YYYY/MM/DD HH:mm:ss');
      } else if (jalaliMoment(value, 'YYYY-MM-DD').format('YYYY-MM-DD') === value) {
        return jalaliMoment(value, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');
      } else {
        return '-'
      }
    } else {
      return value;
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
