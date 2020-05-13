import {Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {FilterInterface} from "../../logic/filter-interface";
import {ApiService} from "../../logic/api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FilterTaskInterface} from "../../logic/filter-task-interface";
import {TaskDurationInterface} from "../../logic/task-duration-interface";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from 'moment';


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

  form: FormGroup;

  filterData: TaskDurationInterface = {
    adminId: 0,
    startAt : '',
    stopAt : ''
  };

  constructor(private api: ApiService){

  }

  ngOnInit(): void {

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
        this.api.boradsCalendarDurationTask(formValue).subscribe((resp: any) => {
          if (resp.result === 1) {
            let calendarEvent = [];
            resp.content.map(time => {
              const taskEvent = {
                title: time.timediff,
                start: new Date(time.startDate),
                end: new Date(time.startDate)
              };

              calendarEvent.push(taskEvent);
            });

            this.calendarDifferentEvents = calendarEvent;

            //console.log(resp);


          } else {
            this.form.enable();
          }
        })
    );
  }

  ngOnDestroy(): void {
  }
}
