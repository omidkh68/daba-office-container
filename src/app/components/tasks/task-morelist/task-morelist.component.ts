import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterTaskInterface} from '../logic/filter-task-interface';

@Component({
  selector: 'app-task-morelist',
  templateUrl: './task-morelist.component.html'
})
export class TaskMorelistComponent {
  rtlDirection: boolean;
  filterData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterTaskInterface,
              public dialogRef: MatDialogRef<TaskMorelistComponent>) {

    this.filterData = this.data;
  }

  closeDialog(item) {
    this.dialogRef.close(item);
  }
}
