import {Component, OnInit} from '@angular/core';
// import {writeFile, copyFile} from 'fs';
// import {tmpdir} from 'os';
// import {join} from 'path';
import {ElectronService} from '../../core/services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  message = '';
  img: string = '';

  constructor(private electron: ElectronService) {
  }

  ngOnInit(): void {
  }

  takeAScreenShot() {
    this.message = 'wait for take a screenshot ....';

    // const thumbSize = this.determineScreenShot();
    // let options = {types: ['screen'], thumbnailSize: thumbSize};
    let options = {types: ['screen'], thumbnailSize: {width: 1920, height: 1080}, fetchWindowIcons: true};

    /*this.electron.desktopCapturer.getSources(options).then((sources) => {
      sources.forEach((source, index) => {
        console.log(source, index);
        // if (source.name === 'Entire Screen' || source.name === 'Screen 1') {
          // const screenshotPath = join(tmpdir(), `screenshot-${index}.png`);
          const screenshotPath = join(`/Users/omidkh68/Desktop/`, `screenshot-${index}.png`);

          writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {
            if (err) {
              return console.log(err.message);
            } else {
              this.electron.shell.openExternal('file://' + screenshotPath);

              /!*copyFile(screenshotPath, `/Users/omidkh68/Desktop/screenshot-${index}.png`, err => {
                console.log(err);
              });*!/

              this.message = `Saved screenshot to: ${screenshotPath}`;
            }
          })
        // }
      })

    }).catch((err) => {
      throw err.message;
    });*/
  }

  closeApp() {
    /*const window = this.electron.remote.getCurrentWindow();
    window.close()*/
  }

  determineScreenShot() {
    /*const screenSize = this.electron.screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);

    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    };*/
  }

}
