import {ElementRef, Injectable} from '@angular/core';
import {Subscription} from "rxjs";
import {EventApiService} from "../../../events/logic/api.service";
import {EventHandlerService} from "../../../events/service/event-handler.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardDatepickerService {

  constructor(private _elemRef: ElementRef = null , private elementByClass:string = null) {

    if(_elemRef){
      document.addEventListener('click', this.offClickHandler.bind(this));
    }

  }

  offClickHandler(event:any) {
    if (!this._elemRef.nativeElement.contains(event.target)) { // check click origin
      this.closePopover();
    }
  }

  closePopover() {
    let tag:any = document.querySelectorAll("." + this.elementByClass + ' .custom-popover');
    if(tag.length){
      tag[0].classList.remove('display-block');
      tag[0].classList.add('display-none')
    }
  }

  openPopover(date: string) {
    let aTags:any = document.querySelectorAll("." + this.elementByClass + " .mat-calendar-body-cell-content");
    let searchText = date;
    let found;
    for (let i = 0; i < aTags.length; i++) {
      if (aTags[i].outerText.trim() == searchText) {
        let tag:any = document.querySelectorAll("." + this.elementByClass + ' .custom-popover');
        tag[0].classList.remove('display-none');
        tag[0].classList.add('display-block');
        aTags[i].appendChild(tag[0]);
        found = aTags[i];
        break;
      }
    }
  }

}
