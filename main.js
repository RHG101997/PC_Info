const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-system-info', async () => {
  try {
    const [
      system,
      cpu,
      mem,
      osInfo,
      graphics,
      diskLayout,
      networkInterfaces,
      battery,
      baseboard,
      chassis
    ] = await Promise.all([
      si.system(),
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.graphics(),
      si.diskLayout(),
      si.networkInterfaces(),
      si.battery(),
      si.baseboard(),
      si.chassis()
    ]);

    return {
      system,
      cpu,
      memory: mem,
      os: osInfo,
      graphics,
      storage: diskLayout,
      network: networkInterfaces,
      battery,
      motherboard: baseboard,
      chassis
    };
  } catch (error) {
    console.error('Error getting system info:', error);
    return { error: 'Failed to retrieve system information' };
  }
});

ipcMain.handle('get-dynamic-info', async () => {
  try {
    const [
      cpuLoad,
      memLayout,
      processes,
      cpuTemperature,
      fsSize
    ] = await Promise.all([
      si.currentLoad(),
      si.memLayout(),
      si.processes(),
      si.cpuTemperature(),
      si.fsSize()
    ]);

    return {
      cpuLoad,
      memLayout,
      processes: processes.list.slice(0, 10),
      temperature: cpuTemperature,
      diskUsage: fsSize
    };
  } catch (error) {
    console.error('Error getting dynamic info:', error);
    return { error: 'Failed to retrieve dynamic information' };
  }
});