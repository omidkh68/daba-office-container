import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TaskDataInterface} from '../logic/task-data-interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';

@Component({
  templateUrl: './task-add.component.html'
})
export class TaskAddComponent implements OnInit, OnDestroy {
  editable: boolean = false;
  form: FormGroup;
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];
  loggedInUser: UserContainerInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private _fb: FormBuilder,
              private userInfoService: UserInfoService,
              public dialogRef: MatDialogRef<TaskAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TaskDataInterface) {
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
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
        assignTo: new FormControl('', Validators.required),
        taskDurationHours: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+')]),
        taskDurationMinutes: new FormControl(0, Validators.required),
        startAt: new FormControl('', Validators.required),
        stopAt: new FormControl('', Validators.required),
        startTime: new FormControl('', Validators.required),
        stopTime: new FormControl('', Validators.required),
        project: new FormControl({}, Validators.required),
        taskDesc: new FormControl(''),
        email: new FormControl('0'),
        boardStatus: new FormControl('', Validators.required),
        taskDateStart: '0000-00-00 00:00:00',
        taskDateStop: '0000-00-00 00:00:00',
        assigner: new FormControl(this.loggedInUser.email, Validators.required),
        trackable: new FormControl(0)
      });

      resolve();
    });
  }

  updateForm(event: FormGroup) {
    this.form = event;

    setTimeout(() => {
      this.submit();
    }, 500);
  }

  cancelBtn(event) {
    if (event) {
      this.dialogRef.close(false);
    }
  }

  submit() {
    // this.form.disable();

    const formInstance = Object.assign(this.form.value);

    console.log(formInstance);

    // this.form.disable();

    const formValue = {
      ...formInstance,
      startAt: formInstance.startAt + ' ' + formInstance.startTime + ':00',
      stopAt: formInstance.stopAt + ' ' + formInstance.stopTime + ':00'
    };

    delete (formValue.taskId);

    console.log(formValue);

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

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
