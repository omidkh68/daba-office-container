import {Pipe, PipeTransform} from '@angular/core';
import * as jalaliMoment from 'jalali-moment';

@Pipe({
  name: 'jalali'
})
export class JalaliPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (jalaliMoment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') === value) {
      return jalaliMoment(value, 'YYYY-MM-DD HH:mm:ss').locale('fa').format('YYYY/MM/DD HH:mm:ss');
    } else if (jalaliMoment(value, 'YYYY-MM-DD').format('YYYY-MM-DD') === value) {
      return jalaliMoment(value, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');
    } else {
      return '-'
    }
  }

}
