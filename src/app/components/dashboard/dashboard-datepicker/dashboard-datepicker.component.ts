import {AfterViewInit, Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {WindowManagerService} from "../../../services/window-manager.service";
import {ServiceItemsInterface} from "../logic/service-items.interface";

@Component({
  selector: 'app-dashboard-datepicker',
  templateUrl: './dashboard-datepicker.component.html',
  styleUrls: ['./dashboard-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDatepickerComponent{

  constructor() {
  }

  @ViewChild('picker') picker;

  @Input()
  rtlDirection: boolean;

  @Input()
  windowManagerService: WindowManagerService;

  @Input()
  serviceList: ServiceItemsInterface[] = [];

  onSelect() {

    //console.log("AOOOOOO" , this.serviceList);

    let service:ServiceItemsInterface[] = this.serviceList.filter(obj => {return obj.serviceTitle == 'events_calendar'})
    this.windowManagerService.openWindowState(service[0])
  }

  dateClass() {
    return (date: any): MatCalendarCellCssClasses => {
      if(this.rtlDirection)
        return date.jDay() == 6 ? 'special-date' : '';
      else
        return date.day() == 5 ? 'special-date' : '';
    };
  }

}
