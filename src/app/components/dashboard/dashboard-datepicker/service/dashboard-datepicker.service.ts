import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardDatepickerService {
  constructor(private elemRef: ElementRef = null,
              private elementByClass: string = null) {
    if (elemRef) {
      document.addEventListener('click', this.offClickHandler.bind(this));
    }
  }

  offClickHandler(event: any) {
    event.stopPropagation();

    if (!this.elemRef.nativeElement.contains(event.target)) { // check click origin
      this.closePopover();
    }
  }

  closePopover() {
    let tag: any = document.querySelectorAll('.' + this.elementByClass + ' .custom-popover');
    if (tag.length) {
      tag[0].classList.remove('display-block');
      tag[0].classList.add('display-none')
    }
  }
}
