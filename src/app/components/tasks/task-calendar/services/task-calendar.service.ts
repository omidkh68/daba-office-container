import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskCalendarService {
  setHolidayHighlight(holidays) {
    const mm: Array<string> = holidays;

    setTimeout(() => {
      let activeList = Array.prototype.slice.call(document.getElementsByClassName('fc-day'));

      activeList.forEach((entry: any) => {
        let variable: string = entry.getAttribute('data-date');

        if (mm.includes(variable)) {
          entry.classList.add('holiday-date');
        }
      });
    }, 500);
  }
}
