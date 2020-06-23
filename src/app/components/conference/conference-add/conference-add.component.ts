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
              @Inject(MAT_DIALOG_DATA) public data) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      username: new FormControl(''),
      confname: new FormControl('')
    });
  }

  createRoom() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
