import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterTaskInterface} from '../logic/filter-task-interface';
import {EventHandlerInterface} from '../../events/logic/event-handler.interface';

@Component({
  selector: 'app-task-morelist',
  templateUrl: './task-morelist.component.html'
})
export class TaskMoreListComponent {
  rtlDirection = false;
  filterData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterTaskInterface,
              public dialogRef: MatDialogRef<TaskMoreListComponent>) {

    this.filterData = this.data;
  }

  alternativeImage(event): void{
    (event.target as HTMLImageElement).src = '/assets/profileImg/0.jpg';
  }

  closeDialog(item) {
    this.dialogRef.close(item);
  }

  addDialog(): void {
    const eventItems: EventHandlerInterface = {
      actionCallback: 'add',
      actionType: null,
      id: null,
      actionTypeJobModel: null,
      description: null,
      endDate: null,
      start: null,
      endDateDisplay: null,
      eTime: null,
      name: null,
      startDate: null,
      startDateDisplay: null,
      creatorUser: null,
      sTime: null,
      reminders: null,
      users: null
    };

    this.dialogRef.close(eventItems);
  }
}
