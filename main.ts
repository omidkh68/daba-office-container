import {app, BrowserWindow, screen, webFrame, ipcMain} from 'electron';
// import {autoUpdater} from 'electron-updater';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {
  let bound = screen.getPrimaryDisplay().bounds;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    transparent: false,
    /*width: 1600,
    height: 900,*/
    width: screen.getPrimaryDisplay().bounds.width - 50,
    height: screen.getPrimaryDisplay().bounds.height - 50,
    frame: true,
    movable: true,
    resizable: false,
    center: true,
    icon: `file://${__dirname}/dist/favicon.png`,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
  });

  if (serve) {
    require('devtron').install();

    // win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.webContents.on('devtools-opened', () => {
        win.webContents.closeDevTools();
    });

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
