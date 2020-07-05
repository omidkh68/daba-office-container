import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../services/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StatusInterface} from '../logic/status-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {UserStatusInterface} from '../../users/logic/user-status-interface';
import {ChangeStatusService} from '../services/change-status.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ChangeUserStatusInterface} from '../logic/change-user-status.interface';
import {ApiService as UserApiService} from '../../users/logic/api.service';
import {ApiService as StatusApiService} from '../logic/api.service';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection: boolean;
  form: FormGroup;
  currentUserStatus: UserStatusInterface | string;
  statusList: StatusInterface[];

  private _subscription: Subscription = new Subscription();

  constructor(private userStatusService: ChangeStatusService,
              private injector: Injector,
              private viewDirection: ViewDirectionService,
              private userApiService: UserApiService,
              private messageService: MessageService,
              private statusApiService: StatusApiService,
              private userInfoService: UserInfoService,
              private fb: FormBuilder,
              private translate: TranslateService,
              public dialogRef: MatDialogRef<ChangeStatusComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  async ngOnInit() {
    await this.getStatuses();
    await this.createForm().then(() => {
      this.form.markAllAsTouched();

      setTimeout(_ => {
        this.checkFormValidation();
      }, 1000);

      this._subscription.add(
        this.userStatusService.currentUserStatus.subscribe(status => this.currentUserStatus = status)
      );
    });
  }

  getStatuses() {
    return new Promise((resolve) => {
      this.statusApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.statusApiService.getStatuses().subscribe((resp: any) => {
          if (resp.result === 1) {
            this.statusList = resp.contents;
          }

          resolve(true);
        })
      );
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        userId: new FormControl(1, Validators.required),
        status: new FormControl('', Validators.required),
        assigner: new FormControl(1),
        statusTime: new FormControl('start'),
        description: new FormControl('')
      });

      resolve();
    });
  }

  checkFormValidation() {
    this._subscription.add(
      this.form.valueChanges.subscribe((selectedValue: ChangeUserStatusInterface) => {

        const descriptionControl = this.form.get('description');

        if (selectedValue.status.statusId === 9) {
          if (this.form.get('description').value.length < 1) {
            descriptionControl.setErrors({'incorrect': true});
            descriptionControl.setValidators(Validators.required);
            descriptionControl.markAsTouched();
          }
        } else {
          descriptionControl.setErrors(null);
          descriptionControl.setValidators(null);
        }
      })
    );
  }

  activeStatus(status: StatusInterface) {
    if (status.statusId === 9) {
      this.dialogRef.updateSize('500px', '475px');
    } else {
      this.dialogRef.updateSize('500px', '355px');
    }

    this.form.get('status').setValue(status);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      this.form.disable();

      const formValue = Object.assign({}, this.form.value);

      formValue.status = formValue.status.statusId;

      this.userApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.userApiService.applyStatusToUser(formValue).subscribe((resp: any) => {
          if (resp.result === 1) {
            this.userStatusService.changeUserStatus(resp.content.user.userCurrentStatus);
            this.dialogRef.close(resp);
          } else {
            this.form.enable();
          }
        })
      );
    } else {
      this.messageService.showMessage(this.getTranslate('status.status_description_error'));
    }
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
