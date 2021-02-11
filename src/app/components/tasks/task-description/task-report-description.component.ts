import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {TaskReportDescriptionInterface} from '../logic/board-interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-task-description',
  templateUrl: './task-report-description.component.html',
})

export class TaskReportDescriptionComponent implements OnInit, OnDestroy {
  rtlDirection = false;
  taskDescription;
  NameDescription;
  taskPercentage;
  DateStop;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: TaskReportDescriptionInterface,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskReportDescriptionComponent>,
              private viewDirection: ViewDirectionService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.taskDescription = this.data.description;
    this.NameDescription = this.data.task.taskName;
    this.taskPercentage = this.data.percentage;
    this.DateStop = this.data.taskDateStop;
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
