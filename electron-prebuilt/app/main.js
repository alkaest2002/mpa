const {app, BrowserWindow} = require('electron');
const path = require('path');
const { fork } = require('child_process');

const ps = fork(path.resolve(__dirname, "server.js"));

const createWindow = () => {

  const mainWindow = new BrowserWindow({
    minWidth: 750,
    minHeight: 850,
    webPreferences: { webSecurity: false }
  });
  
  mainWindow.loadFile(path.resolve(__dirname, "public", "index.html"));
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());
app.on('quit', () => ps.kill());