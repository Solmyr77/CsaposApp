// electron/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing/trashing windows in this file.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // NOTE: If you use preload scripts or enable Node Integration,
      // carefully handle security. For now, let's keep it off.
      nodeIntegration: false,
    },
  });

  // Load our React app (Vite dev server in dev mode, or production build).
  if (process.env.APP_DEV) {
    // Development: Vite's dev server URL
    mainWindow.loadURL('http://localhost:5173'); 
  } else {
    // Production: local index.html file in dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron is ready
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
