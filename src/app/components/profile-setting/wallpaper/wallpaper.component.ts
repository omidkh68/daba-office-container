import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {ViewDirectionService} from "../../../services/view-direction.service";
import {WallpaperSelectorService} from "../../../services/wallpaper-selector.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LoadingIndicatorInterface, LoadingIndicatorService} from "../../../services/loading-indicator.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ElectronService} from "../../../services/electron.service";

@Component({
  selector: 'app-wallpaper',
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.scss']
})

/*code file uploader va base64 az do code tashkil shode, ghesmat haye code aval va dovom moshakhas shode ba code1 code2*/

export class WallpaperComponent implements OnInit, OnDestroy {

  showProgress = true;
  environment;
  rtlDirection: boolean = false;
  private _subscription: Subscription = new Subscription();
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

  wallpapersGrediant = [
    {
      id: 1,
      value: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)'
    },
    {
      id: 2,
      value: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'
    },
    {
      id: 3,
      value: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
    },
    {
      id: 4,
      value: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)'
    },
    {
      id: 5,
      value: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'
    }
  ];

  wallpapersSolidColors = [
    {
      id: 1,
      value: '#9890e3'
    },
    {
      id: 2,
      value: '#fddb92'
    },
    {
      id: 3,
      value: '#e2d1c3'
    },
    {
      id: 4,
      value: '#fef9d7'
    },
    {
      id: 5,
      value: '#f5576c'
    },
    {
      id: 6,
      value: '#43e97b'
    }
  ];

  /*code1*/
  files: any[] = [];
  /*code1*/


  /*code2*/
  imageSrc;
  sellersPermitFile: any;
  sellersPermitString: string = '';
  /*code2*/

  constructor(private _viewDirection: ViewDirectionService,
              private _wallPaperSelector: WallpaperSelectorService,
              public dialogRef: MatDialogRef<WallpaperComponent>,
              private loadingIndicatorService: LoadingIndicatorService,
              private electronService: ElectronService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this._viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit() {
    this.environment = this.electronService.remote.screen.getPrimaryDisplay().workAreaSize;
  }

  /*code1*/
  onFileDropped(files) {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'wallpaper'});
    this.prepareFilesList(files);

    /*code2*/
    const file: File = files[0];
    this.sellersPermitFile = file;
    this.handleInputChange(file); //turn into base64
    /*code2*/
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files.target.files);
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'wallpaper'});

    /*code2*/
    let fileList: FileList = files.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.sellersPermitFile = file;
      this.handleInputChange(file); //turn into base64
    }
    else {
      alert("No file selected");
    }
    /*code2*/
  }

  deleteFile(index: number) {
    console.log('index', index);
    this.files.splice(index, 1);

    this.sellersPermitString = '';
    this.showProgress = true;
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
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'wallpaper'});
            this.showProgress = false;
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
    console.log('0', e);
    // let base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    let base64result = reader.result;

    this.imageSrc = base64result;
    this.sellersPermitString = base64result;
    console.log('1', this.sellersPermitString);
  }
  /*code2*/

  changeWallpaper(value) {
    this._wallPaperSelector.changeWallpaper(value);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
