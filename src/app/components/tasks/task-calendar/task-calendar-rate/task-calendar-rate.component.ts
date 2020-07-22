import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ApiService} from '../../logic/api.service';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {UtilsService} from "../../../../services/utils.service";
import {UserInterface} from "../../../users/logic/user-interface";
import {LoginInterface} from "../../../login/logic/login.interface";

@Component({
  selector: 'app-task-calendar-rate',
  templateUrl: './task-calendar-rate.component.html',
  styleUrls: ['./task-calendar-rate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarRateComponent implements OnChanges ,OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
  @ViewChild('drawer') drawer: any; // the #calendar in the template

  @Input()
  usersList: any;

  @Input()
  loginData: LoginInterface;

  @Input()
  calendarDifferentEvents: any;

  @Input()
  sumTime: any;

  @Input()
  dateStart: any;

  @Input()
  userSelected: UserInterface;

  @Input()
  rtlDirection: boolean;

  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  form: FormGroup;
  private isVisible: boolean = false;
  private _subscription: Subscription = new Subscription();


  constructor(private api: ApiService , private utilService: UtilsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

      if(this.calendarComponent){
        let calendarApi = this.calendarComponent.getApi();
        if (this.dateStart) {
          let month = this.dateStart._d.getMonth() + 1;
          month = this.utilService.pad(month,2,null);
          calendarApi.gotoDate(this.dateStart._d.getFullYear() + "-" + month + "-" + this.dateStart._d.getDate()); // call a method on the Calendar object
          this.drawer.open();

        }
        this.isVisible = true;
      }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
