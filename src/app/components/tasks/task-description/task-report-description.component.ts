import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs/internal/Subscription';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoginInterface} from '../../login/logic/login.interface';
import {UserInterface} from '../../users/logic/user-interface';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  selector: 'app-task-description',
  templateUrl: './task-report-description.html',
})

export class TaskReportDescriptionComponent implements OnInit, OnDestroy {
  @ViewChild
  (MatPaginator, {static: true}) paginator: MatPaginator;

  @Input()
  rtlDirection: boolean;

  @Input()
  loginData: LoginInterface;

  @Input()
  taskId: number = 0;

  @Input()
  editable: boolean;

  @Output()
  cancel = new EventEmitter();

  @Input()
  usersList: Array<UserInterface> = [];

  taskDescription;
  NameDescription;
  taskPercentage;
  DateStop;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private windowManagerService: WindowManagerService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskReportDescriptionComponent>,
              private viewDirection: ViewDirectionService
  ) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.taskDescription = this.data.element.description;
    this.NameDescription = this.data.task.taskName;
    this.taskPercentage = this.data.element.percentage;
    this.DateStop = this.data.element.taskDateStop;
  }

  close() {
    this.dialogRef.close()
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

}
