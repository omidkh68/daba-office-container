import {Injectable} from '@angular/core';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {
  BrowserWindow,
  ipcRenderer,
  desktopCapturer,
  webFrame,
  remote,
  screen
} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  os: typeof os;
  path: typeof path;
  desktopCapturer: typeof desktopCapturer;
  browserWindow: BrowserWindow;
  electronScreen: typeof screen;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.desktopCapturer = window.require('electron').desktopCapturer;
      this.browserWindow = window.require('electron').remote.getCurrentWindow();
      this.remote = window.require('electron').remote;
      this.electronScreen = window.require('electron').screen;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
      this.os = window.require('os');

      this.browserWindow.center();
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
