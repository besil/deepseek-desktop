const { app, Tray, Menu, BrowserWindow } = require('electron');
const path = require('path');

let tray = null;
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    show: true,
    icon: path.join(__dirname, 'icons', 'deepseek-icon-16x16.png'), // Set the main icon
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL('https://chat.deepseek.com/');

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
    return false;
  });
}

app.whenReady().then(() => {
  createWindow();

  const iconPath = path.join(__dirname, 'icons', 'deepseek-icon-16x16-trail.png');
  tray = new Tray(iconPath);

  // Create a context menu for the tray
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open App',
      click: () => {
        win.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  tray.setToolTip('DeepSeek Desktop App');

  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  const nativeImage = require('electron').nativeImage
  const image = nativeImage.createFromPath('icons/deepseek-icon.png')
  app.dock.setIcon(image);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});