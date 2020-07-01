import {Injectable} from '@angular/core';
import {BrowserWindow, ipcRenderer, webFrame, remote, screen, desktopCapturer, shell, Notification, systemPreferences} from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as Store from 'electron-store';
import {UserInfoService} from '../components/users/services/user-info.service';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
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

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor(private userInfoService: UserInfoService) {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
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

      this.userInfoService.currentUserInfo.subscribe(user => {
        this.userInfoService.currentLoginData.subscribe(loginData => {
          const data: any = {
            userInfo: user,
            loginData: loginData
          };

          const store = new Store();

          store.set(data);
        })
      });
    }
  }
}
