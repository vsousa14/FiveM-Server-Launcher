const {app, BrowserWindow, ipcMain, globalShortcut} = require("electron");
const Server = require("./Server");
const CFG = require("./config.json");

let win = null;
let isServerOnline
let overlayWindow = null;
let isOverlayOpened = false;

const createWindow = async () => {
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

    globalShortcut.register('Alt+Shift+S', () =>{
        isOverlayOpened = !isOverlayOpened;
        if(isOverlayOpened){
            createOverlayWin();
        }else{
           if(overlayWindow != null){
            overlayWindow.destroy();
           }
        }
    });
   
}

const createOverlayWin = () => {
    overlayWindow = new BrowserWindow({
        width: 800,
        height:300,
        titleBarStyle: 'hidden',
        titleBarOverlay: false,
        transparent: true,
        resizable: false,
        fullscreen: true
    });

    overlayWindow.loadFile('overlay.html');
}

app.whenReady().then(() => {
    createWindow();
    win.webContents.on('did-finish-load', function() {
        serverStatus(JSON.stringify(CFG.servers[0].ip));
    });
});

ipcMain.on('counter', (event, data) => {
    const incrementedNumber = parseInt(data) + 1;
    win.webContents.send('updateNumber', incrementedNumber);
});

ipcMain.on('counterMinus', (event, data) => {
    if(parseInt(data) < 1) return;
        const decrementedNumber = parseInt(data) - 1;
    win.webContents.send('updateNumber', decrementedNumber);
});

ipcMain.on('fivemOpened', (event, data) => {
    win.webContents.send('fivemCheck', data);
});


const serverStatus = async (ip) =>{
    const API = new Server(ip);
    API.getServerStatus().then((val) => {
        isServerOnline = val.online;
        win.webContents.send("updateStatus",isServerOnline);
    });
}