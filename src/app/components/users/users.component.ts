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
  img: string = '';

  constructor(private api: ApiService,
              private electron: ElectronService,
              protected renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.webFrame.nativeElement.setAttribute('src', 'http://192.168.110.125:90/main.php?username=omid');

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
      })

    }).catch((err) => {
      throw err.message;
    });*/
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

    this.webFrame.nativeElement.setAttribute('src', 'http://192.168.110.125:90/main.php?username=jkasnoqiw');
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
