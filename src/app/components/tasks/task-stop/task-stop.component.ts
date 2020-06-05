import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {ApiService} from '../logic/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  selector: 'app-task-stop',
  templateUrl: './task-stop.component.html',
  styleUrls: ['./task-stop.component.scss']
})
export class TaskStopComponent implements OnInit, OnDestroy {
  form: FormGroup;
  task: TaskInterface;
  rtlDirection: boolean;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private viewDirection: ViewDirectionService,
              private _fb: FormBuilder,
              public dialogRef: MatDialogRef<TaskStopComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TaskInterface) {
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
    this.form.disable();

    this._subscription.add(
      this.api.taskStop(this.form.value).subscribe((resp: any) => {
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
