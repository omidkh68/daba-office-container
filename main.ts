import {app, BrowserWindow, ipcMain, Menu, screen, webFrame} from 'electron';
import {join} from 'path';
import {format} from 'url';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const gotTheLock = app.requestSingleInstanceLock();

function createWindow(): BrowserWindow {
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
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      allowRunningInsecureContent: true
    },
  });

  win.webContents.on('devtools-opened', function () {
    if (!serve) {
      // win.webContents.closeDevTools(); todo: remove
    }
  });

  win.maximize();

  if (serve) {
    require('devtron').install();

    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    // win.setMenu(null); todo: remove

    // Menu.setApplicationMenu(null); todo: remove

    win.loadURL(format({
      pathname: join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.on('closed', () => {
    win = null;
  });

  return win;
}

try {
  app.allowRendererProcessReuse = true;

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

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  if (!gotTheLock) {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  } else {
    app.on('second-instance', () => {
      if (win) {
        if (win.isMinimized()) win.restore();

        win.focus();
      }
    });
  }

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', {version: app.getVersion()});
  });
} catch (e) {
  // Catch Error
  // throw e;
}
