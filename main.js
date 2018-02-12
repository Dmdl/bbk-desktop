const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron');
const url = require('url');
const path = require('path');
const config = require('./config');

let win;

function createWindow() {
    win = new BrowserWindow({show: false});
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'browser.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.maximize();
    win.show();
    setMainMenu();
    win.openDevTools();
}

app.on('ready', createWindow);

// ipcMain.on('onAppStart', (event, arg) => {
//     const {appKey} = config;
//     if (appKey) {
//         event.sender.send('pass-key-check', "Hello World!");
//     } else {
//
//     }
// });

function setMainMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Settings',
                    accelerator: 'CmdOrCtrl+H',
                    click() {
                        //console.log('Oh, hi there!');
                        win.webContents.send('settings', 'text......');
                    }
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}