import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ViewDirectionService} from '../../services/view-direction.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit, OnDestroy {
  rtlDirection = false;
  dialogData: any;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              public dialogRef: MatDialogRef<ApproveComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
