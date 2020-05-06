import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import {TaskInterface} from '../logic/task-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ApiService} from '../logic/api.service';
import {TaskDataInterface} from '../logic/task-data-interface';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  socket = io('http://localhost:4000');
  editable: boolean = false;
  task: TaskInterface;
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];
  form: FormGroup;
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

  constructor(private api: ApiService,
              private _fb: FormBuilder,
              public dialogRef: MatDialogRef<TaskDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TaskDataInterface) {
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;

    if (this.data.action === 'detail') {
      this.task = this.data.task;
    }
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      if (this.data.action === 'detail') {
        this.formPatchValue();
      } else {
        this.editable = true;

        this.form.enable();
      }
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this._fb.group({
        taskId: new FormControl(0),
        taskName: new FormControl('', Validators.required),
        percentage: new FormControl(0, Validators.required),
        assignTo: new FormControl({adminId: 0}, Validators.required),
        taskDurationHours: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+')]),
        taskDurationMinutes: new FormControl(0, Validators.required),
        startAt: new FormControl('', Validators.required),
        stopAt: new FormControl('', Validators.required),
        startTime: new FormControl('', Validators.required),
        stopTime: new FormControl('', Validators.required),
        project: new FormControl({}, Validators.required),
        taskDesc: new FormControl(''),
        boardStatus: new FormControl('', Validators.required),
        taskDateStart: '0000-00-00 00:00:00',
        taskDateStop: '0000-00-00 00:00:00',
        assigner: new FormControl({adminId: 0}, Validators.required),
        trackable: new FormControl(0)
      });

      resolve();
    });
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
    if (this.data.action === 'detail') {
      if (this.editable) {
        this.formPatchValue();
      } else {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
  }

  formPatchValue() {
    this.form.disable();
    this.editable = false;

    const startDate = this.task.startAt.split(' ');
    const stopDate = this.task.stopAt.split(' ');

    const startTimeTmp = startDate[1].split(':');
    const stopTimeTmp = stopDate[1].split(':');

    const startTime = startTimeTmp[0] + ':' + startTimeTmp[1];
    const stopTime = stopTimeTmp[0] + ':' + stopTimeTmp[1];

    const selectedProject = this.projectsList.filter(project => project.projectId === this.task.project.projectId).pop();
    const selectedAssignTo = this.usersList.filter(user => user.adminId === this.task.assignTo.adminId).pop();
    const selectedAssigner = this.usersList.filter(user => user.adminId === 1).pop(); // todo: 1 will be replace with logged in user id

    this.form.patchValue({
      taskId: this.task.taskId,
      taskName: this.task.taskName,
      percentage: this.task.percentage,
      assignTo: selectedAssignTo,
      taskDurationHours: this.task.taskDurationHours,
      taskDurationMinutes: this.task.taskDurationMinutes,
      startAt: startDate[0],
      startTime: startTime,
      stopAt: stopDate[0],
      stopTime: stopTime,
      project: selectedProject,
      taskDesc: this.task.taskDesc,
      boardStatus: this.data.boardStatus,
      taskDateStart: this.task.taskDateStart,
      taskDateStop: this.task.taskDateStop,
      assigner: selectedAssigner,
      trackable: this.task.trackable
    });
  }

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }

  deleteTask() {
    this._subscription.add(
      this.api.deleteTask(this.task).subscribe((resp: any) => {
        this.dialogRef.close(true);
      })
    );
  }

  changeBoardStatus(event) {
    if (event.value === 'todo' && this.data.boardStatus === 'done') {
      this.form.get('percentage').setValue(0);
    } else if (event.value === 'done') {
      this.form.get('percentage').setValue(100);
    }
  }

  submit() {
    this.form.disable();

    const formValue = Object.assign({}, this.form.value);

    formValue.startAt = formValue.startAt + ' ' + formValue.startTime + ':00';
    formValue.stopAt = formValue.stopAt + ' ' + formValue.stopTime + ':00';

    formValue.assigner = this.usersList.filter(user => user.adminId === 1).pop(); // todo: 1 will replace with user logged in user id

    if (this.data.action === 'detail') {
      this._subscription.add(
        this.api.updateTask(formValue).subscribe((resp: any) => {
          if (resp.result === 1) {
            this.dialogRef.close(true);
          } else {
            this.form.enable();
          }
        }, error => {
          this.form.enable();
        })
      );
    } else {
      delete (formValue.taskId);

      this._subscription.add(
        this.api.createTask(formValue).subscribe((resp: any) => {
          if (resp.result === 1) {
            this.dialogRef.close(true);
          } else {
            this.form.enable();
          }
        }, error => {
          this.form.enable();
        })
      );
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
