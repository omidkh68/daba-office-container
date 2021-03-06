import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService as UserApiService} from '../../users/logic/api.service';
import {ApiService as StatusApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {MatDialogRef} from '@angular/material/dialog';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeStatusService} from '../services/change-status.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {StatusDetailInterface, UserStatusInterface} from '../logic/status-interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {StatusChangeResultInterface, StatusListResultInterface} from '../logic/result-interface';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection = false;
  form: FormGroup;
  currentUserStatus: UserStatusInterface | null;
  statusList: Array<StatusDetailInterface> = [];
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'userStatus'};

  private _subscription: Subscription = new Subscription();

  constructor(public dialogRef: MatDialogRef<ChangeStatusComponent>,
              private fb: FormBuilder,
              private injector: Injector,
              private translate: TranslateService,
              private userApiService: UserApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private statusApiService: StatusApiService,
              private viewDirection: ViewDirectionService,
              private userStatusService: ChangeStatusService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  async ngOnInit(): Promise<any> {
    await this.getStatuses();
    await this.createForm().then(() => {
      this.form.markAllAsTouched();

      setTimeout(() => this.checkFormValidation(), 200);

      this.currentUserStatus = this.userStatusService.currentStatus;

      let userInfo: UserContainerInterface = this.loggedInUser;

      userInfo = {...userInfo, user_status: this.currentUserStatus};

      this.userInfoService.changeUserInfo(userInfo);

      if (this.currentUserStatus) {
        this.form.patchValue({
          status: this.currentUserStatus.status_detail
        });
      }
    });
  }

  getStatuses(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'userStatus'});

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

  createForm(): Promise<boolean> {
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

  checkFormValidation(): void {
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

  activeStatus(status: StatusDetailInterface): void {
    if (status.is_description) {
      this.dialogRef.updateSize('500px', '490px');

      this.form.get('is_description').setValue(status.is_description);
    } else {
      this.dialogRef.updateSize('500px', '385px');
    }

    this.form.get('status').setValue(status);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.valid) {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'userStatus'});

      this.form.disable();

      this.dialogRef.disableClose = true;

      const formValue = Object.assign({}, this.form.value);

      formValue.status = formValue.status.id;

      if (!formValue.description.length) {
        delete(formValue.is_description);
        delete(formValue.description);
      }

      this.statusApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.statusApiService.userChangeStatus(formValue).subscribe((resp: StatusChangeResultInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'userStatus'});

          this.dialogRef.disableClose = false;

          if (resp.success) {
            this.userStatusService.changeUserStatus(resp.data);

            const userInfo: UserContainerInterface = {...this.loggedInUser, user_status: resp.data};

            this.userInfoService.changeUserInfo(userInfo);

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
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message, 'error');
          }

          this.dialogRef.disableClose = false;

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

  getTranslate(word: string): Promise<string> {
    return new Promise((resolve) => resolve(this.translate.instant(word)));
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
