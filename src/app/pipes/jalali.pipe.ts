import {Pipe, PipeTransform} from '@angular/core';
import * as jalaliMoment from 'jalali-moment';

@Pipe({
  name: 'jalali'
})
export class JalaliPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (args[0]) {
      if (jalaliMoment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') === value) {
        return jalaliMoment(value, 'YYYY-MM-DD HH:mm:ss').locale('fa').format('YYYY/MM/DD HH:mm:ss');
      } else if (jalaliMoment(value, 'YYYY-MM-DD').format('YYYY-MM-DD') === value) {
        return jalaliMoment(value, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');
      } else if (jalaliMoment(value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') === value) {
        return jalaliMoment(value, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');
      }
      else {
        return '-'
      }
    } else {
      return value;
    }
  }
}




