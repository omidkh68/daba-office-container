import {Component, ElementRef, Inject, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {JoinInterface, LmsResultInterface, RoomInterface} from '../logic/lms.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {ElectronService} from '../../../core/services';

@Component({
  selector: 'app-learning-system-password',
  templateUrl: './learning-system-password.component.html'
})
export class LearningSystemPasswordComponent extends LoginDataClass implements OnInit, OnDestroy {
  @ViewChild('roomPass') roomPass: ElementRef<HTMLInputElement>;

  form: FormGroup;
  rtlDirection = false;
  loadingIndicator: LoadingIndicatorInterface = null;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: RoomInterface,
              private fb: FormBuilder,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private electronService: ElectronService,
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
    this.createForm().then(() => {
      this.roomPass.nativeElement.focus();
    });
  }

  createForm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        meetingID: new FormControl(this.data.roomName),
        password: new FormControl(''),
        userName: new FormControl(this.loggedInUser.email.split('@')[0])
      });

      resolve(true);
    });
  }

  cancelBtn(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
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
        this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'roomPassword'});
      })
    );
  }

  get isElectron(): boolean {
    return this.electronService.isElectron;
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
