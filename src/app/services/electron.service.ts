import {Injectable} from '@angular/core';
import {
  BrowserWindow,
  desktopCapturer,
  ipcRenderer,
  ipcMain,
  Notification,
  remote,
  screen,
  shell,
  systemPreferences,
  webFrame
} from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  ipcMain: typeof ipcMain;
  webFrame: typeof webFrame;
  remote: typeof remote;
  shell: typeof shell;
  screen;
  desktopCapturer: typeof desktopCapturer;
  fs: typeof fs;
  os: typeof os;
  path: typeof path;
  notification: typeof Notification;
  systemPreferences: typeof systemPreferences;
  window: BrowserWindow;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.ipcMain = window.require('electron').ipcMain;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.fs = window.require('fs');
      this.desktopCapturer = window.require('electron').desktopCapturer;
      this.shell = window.require('electron').shell;
      this.screen = screen;
      this.os = os;
      this.path = path;
      this.notification = Notification;
      this.systemPreferences = window.require('electron').remote.systemPreferences;
      this.window = window.require('electron').remote.getCurrentWindow();

      this.window.center();
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
