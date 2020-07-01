import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserInfoService} from '../../users/services/user-info.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-task-stop',
  templateUrl: './task-stop.component.html',
  styleUrls: ['./task-stop.component.scss']
})
export class TaskStopComponent extends LoginDataClass implements OnInit, OnDestroy {
  form: FormGroup;
  task: TaskInterface;
  rtlDirection: boolean;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private injector: Injector,
              private viewDirection: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService,
              private _fb: FormBuilder,
              private userInfoService: UserInfoService,
              public dialogRef: MatDialogRef<TaskStopComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TaskInterface) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this.task = data;
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this.form.patchValue({
        taskId: this.task.taskId,
        percentage: this.task.percentage
      })
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this._fb.group({
        taskId: new FormControl(0),
        description: new FormControl('', Validators.required),
        percentage: new FormControl(0, Validators.required)
      });

      resolve(true);
    });
  }

  submit() {
    this.loadingIndicatorService.changeLoadingStatus(true);

    this.form.disable();

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.taskStop(this.form.value).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus(false);

        if (resp.result === 1) {
          this.dialogRef.close(true);
        } else {
          this.form.enable();
        }
      }, error => {
        this.loadingIndicatorService.changeLoadingStatus(false);

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
