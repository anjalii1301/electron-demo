const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendAppVersion: () => ipcRenderer.send('app_version'),
  onAppVersion: (callback) => ipcRenderer.on('app_version', callback),
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  sendRestartApp: () => ipcRenderer.send('restart_app')
});
