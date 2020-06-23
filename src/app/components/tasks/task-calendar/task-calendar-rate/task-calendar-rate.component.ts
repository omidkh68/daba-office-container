import {Component , Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FormControl, FormGroup} from "@angular/forms";
import { Calendar } from "@fullcalendar/core";
import {Subscription} from "rxjs";
import {ApiService} from "../../logic/api.service";
import {TaskDurationInterface} from "../../logic/task-duration-interface";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from 'moment';
import {FullCalendarComponent} from "@fullcalendar/angular";


@Component({
  selector: 'app-task-calendar-rate',
  templateUrl: './task-calendar-rate.component.html',
  styleUrls: ['./task-calendar-rate.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class TaskCalendarRateComponent implements OnInit, OnDestroy {

  calendarPlugins = [dayGridPlugin , timeGridPlugin];
  calendarDifferentEvents: any;
  @Input()
  usersList: any;
  sumTime:string = '';

  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarApi: Calendar;

  form: FormGroup;

  filterData: TaskDurationInterface = {
    adminId: 0,
    dateStart : '',
    dateStop : ''
  };

  constructor(private api: ApiService){

  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }
  ngOnInit(): void {

    // setTimeout(()=> {
    //   this.calendarApi = this.calendarComponent.getApi();
    //
    // },3000)

    this.form = new FormGroup({
      adminId: new FormControl(0),
      dateStart: new FormControl(''),
      dateStop : new FormControl('')
    });

  }
  private _subscription: Subscription = new Subscription();

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }

  submit(){

    const formValue: TaskDurationInterface = Object.assign({}, this.form.value);




    this._subscription.add(
        this.api.boardsCalendarDurationTask(formValue).subscribe((resp: any) => {
          if (resp.result === 1) {
            let calendarEvent = [];
            let sum = 0;
            resp.content[0].map(time => {
              const taskEvent = {
                title: time.timediff,
                start: new Date(time.startDate),
                end: new Date(time.startDate)
              };

              calendarEvent.push(taskEvent);
            });

            this.sumTime = resp.content[1][0].timeSum;

            this.calendarDifferentEvents = calendarEvent;
            let calendarApi = this.calendarComponent.getApi();
            if(formValue.dateStart)
              calendarApi.gotoDate(formValue.dateStart); // call a method on the Calendar object



          } else {
            this.form.enable();
          }
        })
    );
  }

  ngOnDestroy(): void {
  }
}
