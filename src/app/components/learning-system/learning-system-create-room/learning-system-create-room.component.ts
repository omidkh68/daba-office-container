import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LmsInterface, LmsResultInterface} from '../logic/lms.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-learning-system-create-room',
  templateUrl: './learning-system-create-room.component.html'
})
export class LearningSystemCreateRoomComponent extends LoginDataClass implements OnInit, OnDestroy {
  form: FormGroup;
  rtlDirection = false;
  loadingIndicator: LoadingIndicatorInterface = null;

  private _subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private injector: Injector,
              private apiService: ApiService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private viewDirectionService: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService,
              private dialogRef: MatDialogRef<LearningSystemCreateRoomComponent>) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirectionService.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm().finally();
  }

  createForm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        banner: new FormControl(this.getTranslate('learning.welcome_banner')),
        bannerC: new FormControl('#5356ad'),
        meetingID: new FormControl('', Validators.required),
        viewerPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
        moderatorPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
        isWebCamModeratorOnly: new FormControl(''),
        isRecord: new FormControl(''),
        isMuteOnStart: new FormControl(''),
        isUserWebCamDisable: new FormControl(''),
        isUserMicDisable: new FormControl(''),
        isPrivateChatDisable: new FormControl(''),
        isPublicChatDisable: new FormControl(''),
        moderatorWelcomeMsg: new FormControl(''),
        userName: new FormControl(this.loggedInUser.email.split('@')[0]),
        welcomeText: new FormControl('')
      });

      resolve(true);
    });
  }

  cancelBtn(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'createRoom'});

    const formValue: LmsInterface = this.form.value;

    formValue.isWebCamModeratorOnly = formValue.isWebCamModeratorOnly ? 'true' : 'false';
    formValue.isRecord = formValue.isRecord ? 'true' : 'false';
    formValue.isMuteOnStart = formValue.isMuteOnStart ? 'true' : 'false';
    formValue.isUserWebCamDisable = formValue.isUserWebCamDisable ? 'true' : 'false';
    formValue.isUserMicDisable = formValue.isUserMicDisable ? 'true' : 'false';
    formValue.isPrivateChatDisable = formValue.isPrivateChatDisable ? 'true' : 'false';
    formValue.isPublicChatDisable = formValue.isPublicChatDisable ? 'true' : 'false';

    this.form.disable();

    this._subscription.add(
      this.apiService.createRoom(formValue).subscribe((resp: LmsResultInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'createRoom'});

        if (resp.result === 'SUCCESSFUL') {
          this.dialogRef.close(resp.content);
        } else {
          this.form.enable();
        }
      }, () => {
        this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'createRoom'});
      })
    );
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
