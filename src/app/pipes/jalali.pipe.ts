import {Pipe, PipeTransform} from '@angular/core';
import * as jalaliMoment from 'jalali-moment';

@Pipe({
  name: 'jalali'
})
export class JalaliPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    return jalaliMoment(value, 'YYYY-MM-DD HH:mm:ss').locale('fa').format('YYYY-MM-DD HH:mm:ss');
  }

}
