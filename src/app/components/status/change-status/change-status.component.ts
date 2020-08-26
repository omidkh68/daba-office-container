import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../services/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StatusDetailInterface, UserStatusInterface} from '../logic/status-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {ChangeStatusService} from '../services/change-status.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {ApiService as UserApiService} from '../../users/logic/api.service';
import {ApiService as StatusApiService} from '../logic/api.service';
import {StatusListResultInterface, StatusChangeResultInterface} from '../logic/result-interface';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection: boolean;
  form: FormGroup;
  currentUserStatus: UserStatusInterface | string;
  statusList: Array<StatusDetailInterface> = [];
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'userStatus'};

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
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService,
              public dialogRef: MatDialogRef<ChangeStatusComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
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
        this.userStatusService.currentUserStatus.subscribe(status => {
          this.currentUserStatus = status;

          this.form.patchValue({
            status: this.currentUserStatus.status_detail
          })
        })
      );
    });
  }

  getStatuses() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'userStatus'});

    return new Promise((resolve, reject) => {
      this.statusApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.statusApiService.getStatuses().subscribe((resp: StatusListResultInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'userStatus'});

          if (resp.success) {
            this.statusList = resp.data;

            resolve(true);
          } else {
            reject(true);
          }
        }, error => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'userStatus'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        user_id: new FormControl(this.loggedInUser.id, Validators.required),
        status: new FormControl({}, Validators.required),
        is_description: new FormControl(0),
        description: new FormControl('')
      });

      resolve();
    });
  }

  checkFormValidation() {
    this._subscription.add(
      this.form.valueChanges.subscribe(selectedValue => {

        const descriptionControl = this.form.get('description');

        if (selectedValue.status.is_description) {
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

  activeStatus(status: StatusDetailInterface) {
    if (status.is_description) {
      this.dialogRef.updateSize('500px', '490px');

      this.form.get('is_description').setValue(status.is_description);
    } else {
      this.dialogRef.updateSize('500px', '385px');
    }

    this.form.get('status').setValue(status);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'userStatus'});

      this.form.disable();

      const formValue = Object.assign({}, this.form.value);

      formValue.status = formValue.status.id;

      this.statusApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.statusApiService.userChangeStatus(formValue).subscribe((resp: StatusChangeResultInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'userStatus'});

          if (resp.success) {
            this.userStatusService.changeUserStatus(resp.data);

            this.getTranslate('status.status_success').then((msg: string) => {
              this.messageService.showMessage(msg);
            });

            this.dialogRef.close(resp);
          } else {
            this.getTranslate('status.status_description_error').then((msg: string) => {
              this.messageService.showMessage(msg);
            });

            this.form.enable();
          }
        }, error => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'userStatus'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    } else {
      this.getTranslate('status.status_description_error').then((msg: string) => {
        this.messageService.showMessage(msg);
      });
    }
  }

  getTranslate(word) {
    return new Promise((resolve, reject) => {
      resolve(this.translate.instant(word));
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
