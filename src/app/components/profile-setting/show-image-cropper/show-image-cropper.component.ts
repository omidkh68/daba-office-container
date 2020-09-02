import {Component, Inject, Injector, OnInit} from '@angular/core';
import {Dimensions, ImageCroppedEvent, ImageTransform} from 'ngx-image-cropper';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ProfileSettingService} from '../logic/profile-setting.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MessageService} from "../../../services/message.service";
import {CheckLoginInterface} from "../../login/logic/check-login.interface";

@Component({
  selector: 'app-show-image-cropper',
  templateUrl: './show-image-cropper.component.html',
  styleUrls: ['./show-image-cropper.component.scss']
})
export class ShowImageCropperComponent extends LoginDataClass implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  dialogData;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'imageCropper'};

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private profileSettingService: ProfileSettingService,
              private loadingIndicatorService: LoadingIndicatorService,
              private translate: TranslateService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private messageService: MessageService,
              public dialogRef: MatDialogRef<ShowImageCropperComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngOnInit() {
    this.dialogData = this.data;

    this.fileChangeEvent(this.dialogData.data);
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'imageCropper'});

    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    const finalValue = {};

    finalValue['profile_image'] = this.croppedImage;

    this._subscription.add(
      this.profileSettingService.updateUser(finalValue, this.loggedInUser.id).subscribe((resp: CheckLoginInterface) => {

        if (resp.success) {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'imageCropper'});

          let temp = this.loggedInUser;

          temp = {...temp, profile_image: 'assets/profileImg/0.jpg'};

          this.userInfoService.changeUserInfo(temp);

          temp = {...temp, profile_image: resp.data.profile_image};

          this.userInfoService.changeUserInfo(temp);

          this.dialogRef.close();
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'imageCropper'});
      })
    );
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  loadImageFailed() {
    const successfulMessage = this.getTranslate('profileSettings.error_upload');

    this.messageService.showMessage(successfulMessage, 'error');
  }

  rotateLeft() {
    this.canvasRotation--;

    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;

    this.flipAfterRotate();
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }
}
