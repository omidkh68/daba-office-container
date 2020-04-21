import {app, BrowserWindow, screen, webFrame, ipcMain} from 'electron';
// import {autoUpdater} from 'electron-updater';
import * as path from 'path';
import * as url from 'url';

let mainWindow: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {
    let bound = screen.getPrimaryDisplay().bounds;

    // Create the browser window.
    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        transparent: true,
        width: bound.width - (bound.width * 0.2),
        height: bound.height - (bound.height * 0.2),
        frame: false,
        movable: true,
        resizable: false,
        center: true,
        icon: `file://${__dirname}/dist/favicon.png`,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
        },
    });

    if (serve) {
        mainWindow.webContents.openDevTools();

        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        mainWindow.loadURL('http://localhost:4200');

    } else {
        /*mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools();
        });*/

        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
/*
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });*/

    return mainWindow;
}

try {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    app.commandLine.appendSwitch('disable-pinch');

    if (mainWindow !== null) {
        const webContents = mainWindow.webContents;

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
        if (mainWindow === null) {
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
