import {Injectable} from '@angular/core';
import {ipcRenderer, webFrame, remote, screen, desktopCapturer, shell, Notification, systemPreferences} from 'electron';
import * as childProcess from 'child_process';
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
  shell: typeof shell;
  screen: typeof screen;
  desktopCapturer: typeof desktopCapturer;
  childProcess: typeof childProcess;
  fs: typeof fs;
  os: typeof os;
  path: typeof path;
  notification: typeof Notification;
  systemPreferences: typeof systemPreferences;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.childProcess = window.require('electron');
      this.fs = window.require('fs');
      this.desktopCapturer = window.require('electron').desktopCapturer;
      this.shell = window.require('electron').shell;
      this.screen = window.require('electron').screen;
      this.os = os;
      this.path = path;
      this.notification = Notification;
      this.systemPreferences = window.require('electron').remote.systemPreferences;

      const win = remote.getCurrentWindow();
      win.center();
    }
  }
}
