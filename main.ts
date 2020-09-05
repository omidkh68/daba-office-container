import {app, BrowserWindow, ipcMain, Menu, screen, webFrame} from 'electron';
// import {autoUpdater} from 'electron-updater';
import * as path from 'path';
import {join} from 'path';
import * as url from 'url';
import * as Datastore from 'nedb';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const gotTheLock = app.requestSingleInstanceLock();

function createWindow(): BrowserWindow {
  let bound = screen.getPrimaryDisplay().bounds;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    transparent: false,
    minWidth: screen.getPrimaryDisplay().workAreaSize.width,
    minHeight: screen.getPrimaryDisplay().workAreaSize.height,
    frame: true,
    movable: true,
    resizable: true,
    maximizable: true,
    center: true,
    autoHideMenuBar: true,
    icon: join(__dirname, 'assets/icons/favicon.256x256.png'),
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      // allowRunningInsecureContent: (serve) ? true : false,
      // allowRunningInsecureContent: true
    },
  });

  win.webContents.on('devtools-opened', function () {
    if (!serve) {
      // win.webContents.closeDevTools();
    }
  });

  win.maximize();

  if (serve) {
    require('devtron').install();

    //const debug = require('electron-debug');
    //debug();
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.setMenu(null);

    Menu.setApplicationMenu(null);

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  /*
      mainWindow.once('ready-to-show', () => {
          autoUpdater.checkForUpdatesAndNotify();
      });*/

  let userInfoDb: Datastore = new Datastore({
    filename: path.join(__dirname, 'Collections.db'),
    autoload: true
  });

  const globalAny: any = global;

  globalAny.collectionsDb = userInfoDb;

  return win;
}

try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  app.commandLine.appendSwitch('disable-pinch');

  if (win !== null) {
    const webContents = win.webContents;

    webContents.on('did-finish-load', () => {
      webFrame.setZoomLevel(1);
      webFrame.setVisualZoomLevelLimits(1, 1);
      webFrame.setLayoutZoomLevelLimits(0, 0);
    });
  }

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  /*if (!gotTheLock) {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (win) {
        if (win.isMinimized()) win.restore();

        win.focus();
      }
    });
  }

  // todo: remove comment

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', {version: app.getVersion()});
  });

  /*ipcMain.on('restart_app', () => {
      autoUpdater.quitAndInstall();
  });*/

  /*autoUpdater.on('update-available', () => {
      mainWindow.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
      mainWindow.webContents.send('update_downloaded');
  });*/

} catch (e) {
  // Catch Error
  // throw e;
}
