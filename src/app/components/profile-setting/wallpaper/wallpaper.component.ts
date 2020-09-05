import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ElectronService} from '../../../services/electron.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ProfileSettingService} from '../logic/profile-setting.service';
import {WallpaperSelectorService} from '../../../services/wallpaper-selector.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {CheckLoginInterface} from "../../login/logic/check-login.interface";

@Component({
  selector: 'app-wallpaper',
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.scss']
})

/*code file uploader va base64 az do code tashkil shode, ghesmat haye code aval va dovom moshakhas shode ba code1 code2*/

export class WallpaperComponent extends LoginDataClass implements OnInit, OnDestroy {
  showProgress = false;
  showDelete = false;
  environment;
  rtlDirection: boolean = false;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'wallpaper'};
  wallpapersPictures = [
    {
      id: 1,
      value: 'url(./assets/images/wallpapers/1.jpg)'
    },
    {
      id: 2,
      value: 'url(./assets/images/wallpapers/2.jpg)'
    },
    {
      id: 3,
      value: 'url(./assets/images/wallpapers/3.jpg)'
    },
    {
      id: 4,
      value: 'url(./assets/images/wallpapers/4.jpg)'
    },
    {
      id: 5,
      value: 'url(./assets/images/wallpapers/5.jpg)'
    },
    {
      id: 6,
      value: 'url(./assets/images/wallpapers/6.jpg)'
    },
    {
      id: 7,
      value: 'url(./assets/images/wallpapers/7.jpg)'
    },
    {
      id: 8,
      value: 'url(./assets/images/wallpapers/8.jpg)'
    },
    {
      id: 9,
      value: 'url(./assets/images/wallpapers/9.jpg)'
    },
    {
      id: 10,
      value: 'url(./assets/images/wallpapers/10.jpg)'
    },
    {
      id: 11,
      value: 'url(./assets/images/wallpapers/11.jpg)'
    },
    {
      id: 12,
      value: 'url(./assets/images/wallpapers/12.jpg)'
    },
    {
      id: 13,
      value: 'url(./assets/images/wallpapers/13.jpg)'
    },
    {
      id: 14,
      value: 'url(./assets/images/wallpapers/14.jpg)'
    }
  ];

  /*code1*/
  files: any[] = [];
  /*code2*/
  imageSrc;
  /*code1*/
  sellersPermitFile: any;
  sellersPermitString: string = '';
  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private wallPaperSelector: WallpaperSelectorService,
              public dialogRef: MatDialogRef<WallpaperComponent>,
              private loadingIndicatorService: LoadingIndicatorService,
              private electronService: ElectronService,
              private profileSettingService: ProfileSettingService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit() {
    this.environment = this.electronService.remote.screen.getPrimaryDisplay().workAreaSize;
  }

  /*code1*/
  onFileDropped(files) {
    // this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'wallpaper'});
    this.prepareFilesList(files);

    /*code2*/
    const file: File = files[0];
    this.sellersPermitFile = file;
    this.handleInputChange(file); //turn into base64
    /*code2*/
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files.target.files);
    // this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'wallpaper'});

    /*code2*/
    let fileList: FileList = files.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.sellersPermitFile = file;
      this.handleInputChange(file); //turn into base64
    } else {
      alert('No file selected');
    }
    /*code2*/
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);

    this.sellersPermitString = '';
    this.showProgress = false;
    this.showDelete = false;
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);

            this.onSubmit(this.sellersPermitString);

          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  /*code1*/

  /*code2*/
  handleInputChange(files) {
    let file = files;
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    // let base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    let base64result = reader.result;

    this.imageSrc = base64result;
    this.sellersPermitString = base64result;

    this.showProgress = true;
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'wallpaper'});
  }
  /*code2*/

  onSubmit(img) {
    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    const finalValue = {};

    finalValue['background_image'] = img;

    this._subscription.add(
      this.profileSettingService.updateUser(finalValue, this.loggedInUser.id).subscribe((resp: CheckLoginInterface) => {

        if (resp.success) {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'wallpaper'});
          this.showProgress = false;
          this.showDelete = true;

          let temp = this.loggedInUser;

          temp = {...temp, background_image: resp.data.background_image};

          this.userInfoService.changeUserInfo(temp);

          this.changeWallpaper('url(' + resp.data.background_image + ')');

        }

      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'wallpaper'});
        this.showProgress = false;
        this.showDelete = true;

      })
    );
  }

  changeWallpaper(value) {
    this.wallPaperSelector.changeWallpaper(value);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
