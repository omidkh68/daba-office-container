import {Component, Inject, Injector, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {ViewDirectionService} from "../../../services/view-direction.service";
import {TranslateService} from "@ngx-translate/core";
import {Dimensions, ImageCroppedEvent, ImageTransform} from "ngx-image-cropper";
import {ProfileSettingService} from "../logic/profile-setting.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginDataClass} from "../../../services/loginData.class";
import {UserInfoService} from "../../users/services/user-info.service";
import {LoadingIndicatorInterface, LoadingIndicatorService} from "../../../services/loading-indicator.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'changeLang'};
  rtlDirection: boolean;
  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private profileSettingService: ProfileSettingService,
              private loadingIndicatorService: LoadingIndicatorService,
              private translate: TranslateService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              public dialogRef: MatDialogRef<ShowImageCropperComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'changeLang'});

    const finalValue = {};

    finalValue['profile_image'] = this.croppedImage;

    this._subscription.add(
      this.profileSettingService.updateUser(finalValue, this.loggedInUser.id).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});

        let temp = this.loggedInUser;

        temp = {...temp, profile_image: 'assets/profileImg/0.jpg'};

        this.userInfoService.changeUserInfo(temp);

        temp = {...temp, profile_image: resp.data.profile_image};

        this.userInfoService.changeUserInfo(temp);

        this.dialogRef.close();


        /*if (resp.result) {
          this.bottomSheetData.bottomSheetRef.close();

          this.messageService.showMessage(resp.message);

          this.refreshBoardService.changeCurrentDoRefresh(true);
        } else {
          this.form.enable();
        }*/
      }, (error: HttpErrorResponse) => {
        // this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});

        /*this.refreshLoginService.openLoginDialog(error);*/
      })
    );
    /*if (this.dialogData.action === 'addUser') {
      const finalValue = this.form.value;
      finalValue.c_password = this.form.get('password').value;
      finalValue.timezone = this.form.get('timezone').value.timezone;
      this._subscription.add(
        this._hrManagementService.addUser(finalValue).subscribe((resp: any) => {
            if (resp.status === 200) {
              this.overlayLoading = false;
              this.form.enable();

              this.showMessage(0, resp.body.msg);
              this.dialogRef.close(resp);
            }
          },
          error => {
            this.overlayLoading = false;
            this.form.enable();

            const objectKeys = Object.keys(error.error.error);
            objectKeys.forEach(obj => {
              error.error.error[obj].forEach(val => {
                this.showMessage(1, val);
              });
            });

            if (error.status === 401) {
              this.userInfoService.changeLoginData('');
              this._router.navigateByUrl(`/login`);
            }
          }
        )
      );
    } else if (this.dialogData.action === 'editUser') {
      const finalValue = this.form.value;
      finalValue.c_password = this.form.get('password').value;
      finalValue.timezone = this.form.get('timezone').value.timezone;

      this._subscription.add(
        this._hrManagementService.updateUser(this.form.value, this.dialogData.data.id).subscribe((resp: any) => {
            if (resp.status === 200) {
              this.overlayLoading = false;
              this.form.enable();

              this.showMessage(0, resp.body.msg);
              this.dialogRef.close(resp);
            }
          },
          error => {
            this.overlayLoading = false;
            this.form.enable();
            this.showMessage(1, error.error.msg);

            if (error.status === 401) {
              this.userInfoService.changeLoginData('');
              this._router.navigateByUrl(`/login`);
            }
          }
        )
      );
    }*/
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // console.log(event, base64ToFile(event.base64));



  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    // console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
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

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }
}
