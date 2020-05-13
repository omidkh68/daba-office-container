import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TaskDataInterface} from '../logic/task-data-interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserInfoService} from '../../../services/user-info.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  editable: boolean = false;
  form: FormGroup;
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];
  user: UserInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private _fb: FormBuilder,
              private userInfoService: UserInfoService,
              public dialogRef: MatDialogRef<TaskDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TaskDataInterface) {
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.user = user)
    );
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this.editable = true;

      this.form.enable();
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
        assigner: new FormControl(this.user, Validators.required),
        trackable: new FormControl(0)
      });

      resolve();
    });
  }

  updateForm(event) {
    console.log('update: ', event);
    // this.form = event;
  }

  cancelBtn(event) {
    console.log('cancel: ', event);
    /*if (this.data.action === 'detail') {
      if (this.editable) {
        this.formPatchValue();
      } else {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }*/
  }

  deleteTask(event) {
    console.log(event);
    /*this._subscription.add(
      this.api.deleteTask(this.task).subscribe((resp: any) => {
        this.dialogRef.close(true);
      })
    );*/
  }

  submit() {
    this.form.disable();

    const formValue = Object.assign({}, this.form.value);

    formValue.startAt = formValue.startAt + ' ' + formValue.startTime + ':00';
    formValue.stopAt = formValue.stopAt + ' ' + formValue.stopTime + ':00';

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