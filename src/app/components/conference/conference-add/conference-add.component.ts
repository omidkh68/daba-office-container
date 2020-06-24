import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ViewDirectionService} from '../../../services/view-direction.service';

@Component({
  selector: 'app-conference-add',
  templateUrl: './conference-add.component.html'
})
export class ConferenceAddComponent implements OnInit {
  rtlDirection: boolean;
  form: FormGroup;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private _fb: FormBuilder,
              public dialogRef: MatDialogRef<ConferenceAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    if (this.data.action === 'add') {
      this.form = this._fb.group({
        username: new FormControl(''),
        confname: new FormControl('')
      });
    } else if (this.data.action === 'join') {
      this.form = this._fb.group({
        confAddress: new FormControl('')
      });
    }
  }

  createRoom() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
