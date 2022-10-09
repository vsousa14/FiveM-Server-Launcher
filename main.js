const {app, BrowserWindow, ipcMain, globalShortcut} = require("electron");
const {exec} = require("child_process");
const Server = require("./Server");
const CFG = require("./config.json");
const Shell = require('node-powershell');
const find = require('find-process');

let win = null;
let isServerOnline
let overlayWindow = null;
let isOverlayOpened = false;

const createWindow = async () => {
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        resizable: false,
        frame: false,
        icon: 'icon.ico',
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            devTools:false,
        }
    });

    win.loadFile('index.html');

        //OVERLAY IS WORKING BUT YOU MIGHT FIND SOME ISSUES
        if(CFG.useOverlay){
            globalShortcut.register('Alt+Shift+S', () =>{

                find('name', 'FiveM', true)
                .then(function (list) {
                  console.log('there are %s FiveM process(es)', list.length);
                  if(list.length > 0){
                    isOverlayOpened = !isOverlayOpened;
                    if(isOverlayOpened){
                        createOverlayWin();
                    }else{
                       if(overlayWindow != null){
                        overlayWindow.destroy();
                       }
                    }
                  }
                });
            });
        }
     
}

const createOverlayWin = () => {
    overlayWindow = new BrowserWindow({
        width: 800,
        height:300,
        icon: 'icon.ico',
        titleBarStyle: 'hidden',
        titleBarOverlay: false,
        transparent: true,
        resizable: false,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools:false,
        }
    });

    overlayWindow.loadFile('overlay.html');
}

app.whenReady().then(() => {
    createWindow();
    win.webContents.on('did-finish-load', function() {
        serverStatus(JSON.stringify(CFG.servers[0].ip));
    });
});

ipcMain.on('appClose', (event, data) => {
    win.close();
})

ipcMain.on('overlayClose', (event, data) => {
    overlayWindow.close();
})

ipcMain.on('minimizeApp', (event, data) => {
    win.minimize();
})

ipcMain.on('opendc', (event, data) => {
    const ps = new Shell();
    ps.addCommand("start " + JSON.stringify(CFG.discord));
    ps.invoke();
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

ipcMain.on('serverStatus', (event, data) => {
    console.log("entrei")
    const API = new Server(data);
    API.getServerStatus().then((val) => {
        console.log(val)
        isServerOnline = val.online;
        win.webContents.send("StatusChecker",isServerOnline);
    });
});

ipcMain.on('serverStatusOv', (event, data) => {
    console.log("entrei")
    const API = new Server(data);
    API.getServerStatus().then((val) => {
        console.log(val)
        isServerOnline = val.online;
        overlayWindow.webContents.send("StatusCheckerOv",isServerOnline);
    });
});

const serverStatus = async (ip) =>{
    const API = new Server(ip);
    API.getServerStatus().then((val) => {
        isServerOnline = val.online;
        win.webContents.send("updateStatus",isServerOnline);
    });
}

ipcMain.on('getConnectedPlayers', (event, data) => {
    const API = new Server(data);
    API.getPlayersList().then((val) => {
        win.webContents.send("listPlayers",val);
    });
});


