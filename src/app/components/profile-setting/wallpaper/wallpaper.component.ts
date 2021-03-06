import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {ElectronService} from '../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {CheckLoginInterface} from '../../login/logic/check-login.interface';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ProfileSettingService} from '../logic/profile-setting.service';
import {Observable, Subscription} from 'rxjs';
import {WallpaperSelectorService} from '../../../services/wallpaper-selector.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-wallpaper',
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.scss']
})
export class WallpaperComponent extends LoginDataClass implements OnInit, OnDestroy {
  showProgress = false;
  showDelete = false;
  environment;
  rtlDirection = false;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'wallpaper'};
  wallpapersPictures = [
    {
      id: 1,
      value: 'url(./assets/images/wallpapers/1.jpg)',
      img: './assets/images/wallpapers/1.jpg'
    },
    {
      id: 2,
      value: 'url(./assets/images/wallpapers/2.jpg)',
      img: './assets/images/wallpapers/2.jpg'
    },
    {
      id: 3,
      value: 'url(./assets/images/wallpapers/3.jpg)',
      img: './assets/images/wallpapers/3.jpg'
    },
    {
      id: 4,
      value: 'url(./assets/images/wallpapers/4.jpg)',
      img: './assets/images/wallpapers/4.jpg'
    },
    {
      id: 5,
      value: 'url(./assets/images/wallpapers/5.jpg)',
      img: './assets/images/wallpapers/5.jpg'
    },
    {
      id: 6,
      value: 'url(./assets/images/wallpapers/6.jpg)',
      img: './assets/images/wallpapers/6.jpg'
    },
    {
      id: 7,
      value: 'url(./assets/images/wallpapers/7.jpg)',
      img: './assets/images/wallpapers/7.jpg'
    },
    {
      id: 8,
      value: 'url(./assets/images/wallpapers/8.jpg)',
      img: './assets/images/wallpapers/8.jpg'
    },
    {
      id: 9,
      value: 'url(./assets/images/wallpapers/9.jpg)',
      img: './assets/images/wallpapers/9.jpg'
    },
    {
      id: 10,
      value: 'url(./assets/images/wallpapers/10.jpg)',
      img: './assets/images/wallpapers/10.jpg'
    },
    {
      id: 11,
      value: 'url(./assets/images/wallpapers/11.jpg)',
      img: './assets/images/wallpapers/11.jpg'
    },
    {
      id: 12,
      value: 'url(./assets/images/wallpapers/12.jpg)',
      img: './assets/images/wallpapers/12.jpg'
    },
    {
      id: 13,
      value: 'url(./assets/images/wallpapers/13.jpg)',
      img: './assets/images/wallpapers/13.jpg'
    },
    {
      id: 14,
      value: 'url(./assets/images/wallpapers/14.jpg)',
      img: './assets/images/wallpapers/14.jpg'
    },
    {
      id: 15,
      value: 'url(./assets/images/wallpapers/15.jpg)',
      img: './assets/images/wallpapers/15.jpg'
    },
    {
      id: 16,
      value: 'url(./assets/images/wallpapers/16.jpg)',
      img: './assets/images/wallpapers/16.jpg'
    },
    {
      id: 17,
      value: 'url(./assets/images/wallpapers/17.jpg)',
      img: './assets/images/wallpapers/17.jpg'
    },
    {
      id: 18,
      value: 'url(./assets/images/wallpapers/18.jpg)',
      img: './assets/images/wallpapers/18.jpg'
    },
    {
      id: 19,
      value: 'url(./assets/images/wallpapers/19.jpg)',
      img: './assets/images/wallpapers/19.jpg'
    },
    {
      id: 20,
      value: 'url(./assets/images/wallpapers/20.jpg)',
      img: './assets/images/wallpapers/20.jpg'
    },
    {
      id: 21,
      value: 'url(./assets/images/wallpapers/21.jpg)',
      img: './assets/images/wallpapers/21.jpg'
    },
    {
      id: 22,
      value: 'url(./assets/images/wallpapers/22.jpg)',
      img: './assets/images/wallpapers/22.jpg'
    },
    {
      id: 23,
      value: 'url(./assets/images/wallpapers/23.jpg)',
      img: './assets/images/wallpapers/23.jpg'
    },
    {
      id: 24,
      value: 'url(./assets/images/wallpapers/24.jpg)',
      img: './assets/images/wallpapers/24.jpg'
    },
    {
      id: 25,
      value: 'url(./assets/images/wallpapers/25.jpg)',
      img: './assets/images/wallpapers/25.jpg'
    },
    {
      id: 26,
      value: 'url(./assets/images/wallpapers/26.jpg)',
      img: './assets/images/wallpapers/26.jpg'
    },
    {
      id: 27,
      value: 'url(./assets/images/wallpapers/27.jpg)',
      img: './assets/images/wallpapers/27.jpg'
    }
  ];

  files: any[] = [];
  imageSrc;
  sellersPermitFile: any;
  wallpaperUrl = '';

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<WallpaperComponent>,
              private http: HttpClient,
              private injector: Injector,
              private translate: TranslateService,
              private messageService: MessageService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private wallPaperSelector: WallpaperSelectorService,
              private profileSettingService: ProfileSettingService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.environment = this.electronService.remote.screen.getPrimaryDisplay().workAreaSize;
  }

  onFileDropped(files: Array<any>): void {
    this.prepareFilesList(files);

    const file: File = files[0];

    this.sellersPermitFile = file;
    this.handleInputChange(file); //turn into base64
  }

  fileBrowseHandler(files): void {
    this.prepareFilesList(files.target.files);

    const fileList: FileList = files.target.files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.sellersPermitFile = file;
      this.handleInputChange(file); //turn into base64
    } else {
      alert('No file selected');
    }
  }

  deleteFile(index: number): void {
    this.files.splice(index, 1);
    this.wallpaperUrl = '';
    this.showProgress = false;
    this.showDelete = false;
  }

  uploadFilesSimulator(index: number): void {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);

            this.onSubmit(this.wallpaperUrl);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 500);
  }

  prepareFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes: number, decimals = 0): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  handleInputChange(files): void {
    const file = files;
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e): void {
    const reader = e.target;
    const base64result = reader.result;

    this.imageSrc = base64result;
    this.wallpaperUrl = base64result;

    this.showProgress = true;
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'wallpaper'});
  }

  onSubmit(img: string): void {
    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    const formValue = {};

    formValue['background_image'] = img;

    this._subscription.add(
      this.profileSettingService.updateUser(formValue, this.loggedInUser.id).subscribe((resp: CheckLoginInterface) => {
        if (resp.success) {
          const successfulMessage = this.getTranslate('profileSettings.profile_update');

          this.messageService.showMessage(successfulMessage, 'success');

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'wallpaper'});
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});
          this.showProgress = false;
          this.showDelete = true;

          let temp = this.loggedInUser;

          temp = {...temp, background_image: resp.data.background_image};

          this.userInfoService.changeUserInfo(temp);

          this.changeWallpaper(resp.data.background_image);

          this.dialogRef.close();
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message, 'error');
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'wallpaper'});
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});
        this.showProgress = false;
        this.showDelete = true;

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  changeWallpaperPhysical(value: string): void {
    this.http.get(value, {responseType: 'blob'})
      .pipe(
        switchMap(blob => this.convertBlobToBase64(blob))
      )
      .subscribe(base64ImageUrl => {
        this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'wallpaper'});
        this.onSubmit(base64ImageUrl);
      });
  }

  convertBlobToBase64(blob: Blob): Observable<any> {
    return Observable.create(observer => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }

  changeWallpaper(value: string): void {
    this.wallPaperSelector.changeWallpaper(value);
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
