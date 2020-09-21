import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {JoinInterface, LmsResultInterface, RoomInterface} from '../logic/lms.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {MessageService} from '../../message/service/message.service';

@Component({
  selector: 'app-learning-system-password',
  templateUrl: './learning-system-password.component.html'
})
export class LearningSystemPasswordComponent extends LoginDataClass implements OnInit, OnDestroy {
  form: FormGroup;
  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = null;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: RoomInterface,
              private fb: FormBuilder,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private viewDirectionService: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService,
              private dialogRef: MatDialogRef<LearningSystemPasswordComponent>) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirectionService.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        meetingID: new FormControl(this.data.roomName),
        password: new FormControl(''),
        userName: new FormControl(this.loggedInUser.email)
      });

      resolve();
    });
  }

  cancelBtn() {
    this.dialogRef.close(false);
  }

  submit() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'roomPassword'});

    const formValue: JoinInterface = this.form.value;

    this.form.disable();

    this._subscription.add(
      this.apiService.join(formValue).subscribe((resp: LmsResultInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'roomPassword'});

        if (resp.result === 'SUCCESSFUL') {
          this.dialogRef.close(resp.content);
        } else {
          this.form.enable();

          this.messageService.showMessage(this.getTranslate('learning.wrong_password'), 'error');

          this.form.get('password').setErrors({'incorrect': true});
        }
      }, () => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'roomPassword'});
      })
    );
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
