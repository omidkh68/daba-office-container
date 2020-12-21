import {Injectable} from '@angular/core';
import {
  BrowserWindow,
  desktopCapturer,
  ipcRenderer,
  remote,
  webFrame,
  screen as ElectronScreen
} from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  desktopCapturer: typeof desktopCapturer;
  fs: typeof fs;
  os: typeof os;
  path: typeof path;
  browserWindow: BrowserWindow;
  electronScreen;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.desktopCapturer = window.require('electron').desktopCapturer;
      this.fs = window.require('fs');
      this.os = os;
      this.path = path;
      this.browserWindow = window.require('electron').remote.getCurrentWindow();
      this.electronScreen = ElectronScreen;

      this.browserWindow.center();
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
