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
import {Calendar} from '@fullcalendar/core';
import {Subscription} from 'rxjs';
import {ApiService} from '../../logic/api.service';
import {TaskDurationInterface} from '../../logic/task-duration-interface';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
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
export class TaskCalendarRateComponent implements OnInit, OnChanges ,OnDestroy {
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

  //calendarDifferentEvents: any;
  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  calendarApi: Calendar;
  form: FormGroup;
  filterData: TaskDurationInterface = {
    adminId: 0,
    dateStart: '',
    dateStop: ''
  };
  private isVisible: boolean = false;
  private _subscription: Subscription = new Subscription();

  count: number;

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

  ngAfterContentChecked(): void{

    // if(this.isVisible == false && this.sumTime){
    //   if(this.calendarComponent){
    //     let calendarApi = this.calendarComponent.getApi();
    //     if (this.dateStart) {
    //       let month = this.dateStart._d.getMonth() + 1;
    //       month = this.utilService.pad(month,2,null);
    //       calendarApi.gotoDate(this.dateStart._d.getFullYear() + "-" + month + "-" + this.dateStart._d.getDate()); // call a method on the Calendar object
    //     }
    //     this.isVisible = true;
    //   }
    //
    // }else{
    //   this.isVisible = false;
    // }
    //console.log("HUSIN SALAM" ,this.sumTime , this.dateStart)

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      adminId: new FormControl(0),
      dateStart: new FormControl(''),
      dateStop: new FormControl('')
    });
  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }



  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
