import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {ImageCroppedEvent, ImageTransform} from 'ngx-image-cropper';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {CheckLoginInterface} from '../../login/logic/check-login.interface';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ProfileSettingService} from '../logic/profile-setting.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-show-image-cropper',
  templateUrl: './show-image-cropper.component.html',
  styleUrls: ['./show-image-cropper.component.scss']
})
export class ShowImageCropperComponent extends LoginDataClass implements OnInit, OnDestroy {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  dialogData;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  rtlDirection = false;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'imageCropper'};

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Event,
              public dialogRef: MatDialogRef<ShowImageCropperComponent>,
              private injector: Injector,
              private translate: TranslateService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private profileSettingService: ProfileSettingService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngOnInit(): void {
    this.dialogData = this.data;

    this.fileChangeEvent(this.dialogData.data);
  }

  closeModal(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'imageCropper'});

    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    const finalValue = {};

    finalValue['profile_image'] = this.croppedImage;

    this._subscription.add(
      this.profileSettingService.updateUser(finalValue, this.loggedInUser.id).subscribe((resp: CheckLoginInterface) => {

        if (resp.success) {

          const successfulMessage = this.getTranslate('profileSettings.profile_update');

          this.messageService.showMessage(successfulMessage, 'success');

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'imageCropper'});

          let temp = this.loggedInUser;

          temp = {...temp, profile_image: 'assets/profileImg/0.jpg'};

          this.userInfoService.changeUserInfo(temp);

          temp = {...temp, profile_image: resp.data.profile_image};

          this.userInfoService.changeUserInfo(temp);

          this.dialogRef.close(true);
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message, 'error');
        }

        this.refreshLoginService.openLoginDialog(error);

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'imageCropper'});
      })
    );
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  imageLoaded(): void {
    this.showCropper = true;
  }

  loadImageFailed(): void {
    const successfulMessage = this.getTranslate('profileSettings.error_upload');

    this.messageService.showMessage(successfulMessage, 'error');
  }

  rotateLeft(): void {
    this.canvasRotation--;

    this.flipAfterRotate();
  }

  rotateRight(): void {
    this.canvasRotation++;

    this.flipAfterRotate();
  }

  flipHorizontal(): void {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical(): void {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut(): void {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn(): void {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio(): void {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private flipAfterRotate(): void {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }
}
