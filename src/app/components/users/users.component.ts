import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2} from '@angular/core';
import {ElectronService} from '../../core/services';
import {ApiService} from './logic/api.service';
import {ScreenshotInterface} from './logic/screenshot-interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  message = '';

  constructor(private api: ApiService,
              private electron: ElectronService,
              protected renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.webFrame.nativeElement.setAttribute('src', 'https://conference.dabacenter.ir/main.php?username=omid&confname=daba');

    this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
      console.log('did-start-loading');
    });
    this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
      console.log('did-stop-loading');
    });
  }

  takeAScreenShot() {
    this.message = 'wait for take a screenshot ....';

    // const thumbSize = this.determineScreenShot();
    // let options = {types: ['screen'], thumbnailSize: thumbSize};
    let options = {types: ['screen'], thumbnailSize: {width: 800, height: 600}, fetchWindowIcons: true};

    this.electron.desktopCapturer.getSources(options).then(async sources => {
      let screenshots: Array<string> = [];

      await sources.map((source, index) => {
        // if (source.name === 'Entire Screen' || source.name === 'Screen 1') {
        // const screenshotPath = this.electron.path.join(this.electron.os.tmpdir(), `screenshot-${index}.png`);

        // console.log(source.thumbnail.toDataURL());
        const screenshotData: string = source.thumbnail.toDataURL({scaleFactor: 1});

        screenshots.push(screenshotData);

        /*this.electron.fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {
          if (err) {
            return console.log(err.message);
          } else {
            this.electron.shell.openExternal('file://' + screenshotPath);

            this.message = `Saved screenshot to: ${screenshotPath}`;
          }
        });*/
        // }
      });

      const data: ScreenshotInterface = {
        userId: {
          adminId: 1,
          username: 'o.khosrojerdi',
          password: '06df60287a737ebf3a177bd3b2c47e01',
          name: 'امید',
          family: 'خسروجردی',
          email: 'khosrojerdi@dabacenter.ir',
          status: '1',
          permission: '11111100000000000000111111111111000000001110000000000000000011111100000000000000110000000000000000000',
          darkMode: 0,
          creationDate: '0000-00-00 00:00:00',
          role: {
            'roleId': 9,
            'roleNameEn': 'UI Manager',
            'roleNameFa': 'مدیر بخش کاربری'
          },
          userCurrentStatus: {
            'statusId': 1,
            'statusNameEn': 'Lunch Time',
            'statusNameFa': 'وقت ناهار',
            'statusStartDate': '2020-05-02 13:14:21',
            'statusStopDate': '0000-00-00 00:00:00'
          }
        },
        files: screenshots
      };

      this.api.createScreenshot(data).subscribe((resp: any) => {
        console.log(resp);
      });

    }).catch((err) => {
      throw err.message;
    });
  }

  openWebView() {
    /*let win = new this.electron.remote.BrowserWindow({ width: 800, height: 600 });
    win.on('closed', () => {
      win = null
    });

    let view = new this.electron.remote.BrowserView();
    win.setBrowserView(view);
    view.setBounds({ x: 0, y: 0, width: 300, height: 300 });
    view.webContents.loadURL('http://192.168.110.125/main.php?username=jkasnoqiw')*/

    this.webFrame.nativeElement.setAttribute('src', 'https://conference.dabacenter.ir/main.php?username=omid&confname=daba');
  }

  closeApp() {
    const window = this.electron.remote.getCurrentWindow();
    window.close()
  }

  determineScreenShot() {
    const screenSize = this.electron.screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);

    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    };
  }

}
