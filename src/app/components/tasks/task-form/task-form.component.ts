import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TaskInterface} from '../logic/task-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
import {TaskDataInterface} from '../logic/task-data-interface';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  @Input()
  form: FormGroup;

  @Input()
  data: TaskDataInterface;

  @Input()
  editable: boolean;

  @Output()
  cancel = new EventEmitter();

  @Output()
  deleteTaskEmitter = new EventEmitter();

  @Output()
  formOutput = new EventEmitter();

  task: TaskInterface;
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];
  durationMinute: Array<number> = [0, 15, 30, 45];
  hours: Array<string> = [
    '00:00', '00:15', '00:30', '00:45',
    '01:00', '01:15', '01:30', '01:45',
    '02:00', '02:15', '02:30', '02:45',
    '03:00', '03:15', '03:30', '03:45',
    '04:00', '04:15', '04:30', '04:45',
    '05:00', '05:15', '05:30', '05:45',
    '06:00', '06:15', '06:30', '06:45',
    '07:00', '07:15', '07:30', '07:45',
    '08:00', '08:15', '08:30', '08:45',
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45',
    '21:00', '21:15', '21:30', '21:45',
    '22:00', '22:15', '22:30', '22:45',
    '23:00', '23:15', '23:30', '23:45'
  ];
  boardsList = [
    {
      id: 'todo',
      name: 'آماده انجام'
    },
    {
      id: 'inProgress',
      name: 'در حال انجام'
    },
    {
      id: 'done',
      name: 'به اتمام رسیده'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor() {
  }

  ngOnInit(): void {
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;

    if (this.data.action === 'detail') {
      this.task = this.data.task;
    }
  }

  editableForm(toggle) {
    this.editable = toggle;

    if (toggle) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  cancelBtn() {
    this.cancel.emit(true);
  }

  deleteTask() {
    this.deleteTaskEmitter.emit(true);
  }

  changeBoardStatus(event) {
    if (event.value === 'todo' && this.data.boardStatus === 'done') {
      this.form.get('percentage').setValue(0);
    } else if (event.value === 'done') {
      this.form.get('percentage').setValue(100);
    }
  }

  submit() {
    this.formOutput.emit(this.form);
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
