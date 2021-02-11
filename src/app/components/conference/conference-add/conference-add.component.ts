import {Component, Inject, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ConferenceAddInterface} from '../logic/conference.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-conference-add',
  templateUrl: './conference-add.component.html'
})
export class ConferenceAddComponent extends LoginDataClass implements OnInit {
  rtlDirection = false;
  form: FormGroup;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private injector: Injector,
              private fb: FormBuilder,
              private userInfoService: UserInfoService,
              public dialogRef: MatDialogRef<ConferenceAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConferenceAddInterface) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      username: new FormControl(this.loggedInUser.email.replace('@dabacenter.ir', '')),
      confname: new FormControl('')
    });
  }

  createRoom(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
