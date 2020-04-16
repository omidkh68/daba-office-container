import {Component, OnInit} from '@angular/core';
import {desktopCapturer, screen, shell, remote} from 'electron';
import {writeFile} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  message = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  takeAScreenShot() {
    this.message = 'wait for take a screenshot ....';

    // const thumbSize = this.determineScreenShot();
    // let options = {types: ['screen'], thumbnailSize: thumbSize};
    let options = {types: ['screen'], thumbnailSize: {width: 1920, height: 1080}};

    desktopCapturer.getSources(options).then((sources) => {

      sources.forEach((source) => {
        if (source.name === 'Entire Screen' || source.name === 'Screen 1') {
          const screenshotPath = join(tmpdir(), 'screenshot.png');

          writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {
            if (err) {
              return console.log(err.message);
            } else {
              shell.openExternal('file://' + screenshotPath);

              this.message = `Saved screenshot to: ${screenshotPath}`;
            }
          })
        }
      })

    }).catch((err) => {
      throw err.message;
    });
  }

  closeApp() {
    const window = remote.getCurrentWindow();
    window.close()
  }

  determineScreenShot() {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);

    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    };
  }

}
