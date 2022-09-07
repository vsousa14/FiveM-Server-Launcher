const {app, BrowserWindow, ipcMain} = require("electron");

let win = null;

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile('index.html');

}

app.whenReady().then(createWindow);

ipcMain.on('counter', (event, data) => {
    const incrementedNumber = parseInt(data) + 1;
    win.webContents.send('updateNumber', incrementedNumber);
});

ipcMain.on('counterMinus', (event, data) => {
    if(parseInt(data) < 1) return;
        const decrementedNumber = parseInt(data) - 1;
    win.webContents.send('updateNumber', decrementedNumber);
});