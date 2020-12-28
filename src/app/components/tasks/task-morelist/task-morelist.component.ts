import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterTaskInterface} from '../logic/filter-task-interface';

@Component({
  selector: 'app-task-morelist',
  templateUrl: './task-morelist.component.html'
})
export class TaskMorelistComponent implements OnInit {
  rtlDirection: boolean;
  filterData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterTaskInterface,
              public dialogRef: MatDialogRef<TaskMorelistComponent>) {

    this.filterData = this.data;
  }


  closeDialog(item , event){
    this.dialogRef.close(item);
  }

  ngOnInit(): void {
    console.log(this.filterData);
  }

}
