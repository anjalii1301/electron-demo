const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script
      contextIsolation: true,  // Security feature
      enableRemoteModule: false,  // Disable remote module
      nodeIntegration: false,  // Disable node integration
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();  // Check for updates when the window is ready
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Send app version to renderer
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

// Notify renderer when update is available
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

// Notify renderer when update is downloaded
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

// Handle restart request from renderer
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
