import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {TaskDurationInterface} from "../../logic/task-duration-interface";
import {LoadingIndicatorService} from '../../../../services/loading-indicator.service';
import {ApiService} from "../../logic/api.service";
import {Subscription} from "rxjs";
import {UserInterface} from "../../../users/logic/user-interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from 'moment';
import {LoginInterface} from "../../../login/logic/login.interface";

@Component({
  selector: 'app-task-calendar-filter',
  templateUrl: './task-calendar-filter.component.html',
  styleUrls: ['./task-calendar-filter.component.scss']
})
export class TaskCalendarFilterComponent implements OnInit{


  loginData: LoginInterface;

  @Input()
  sumTime: any;

  @Input()
  calendarComponent: any;

  usersList: UserInterface[];

  userSelected: UserInterface;
  userSelectedCheck: boolean;

  form: FormGroup;
  calendarDifferentEvents: any;

  rtlDirection: boolean;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService ,
              private loadingIndicatorService: LoadingIndicatorService,
              private dialogRef: MatDialogRef<TaskCalendarFilterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
    this.usersList = this.data.usersList;
    this.loginData = this.data.loginData;
    this.rtlDirection = this.data.rtlDirection;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      adminId: new FormControl(0),
      dateStart: new FormControl(''),
      dateStop: new FormControl('')
    });
  }

  selected(user) {
    if(this.userSelectedCheck){
      console.log(user);
      this.userSelected = user;
      this.userSelectedCheck = false;
    }else{
      if(typeof this.userSelectedCheck === 'undefined'){
        this.userSelectedCheck = true;
        this.userSelected = user;
      }else{
        this.userSelectedCheck = true;
      }
    }

  }

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }

  submit() {

    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    const formValue: TaskDurationInterface = Object.assign({}, this.form.value);

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
        this.api.boardsCalendarDurationTask(formValue).subscribe((resp: any) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

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

            let parameter = {
              sumTime : this.sumTime,
              calendarEvent: calendarEvent,
              dateStart: formValue.dateStart,
              userSelected : this.userSelected
          }
            this.dialogRef.close(parameter);
          } else {
            this.form.enable();
          }
        }, error => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});
        })
    );
  }
}
