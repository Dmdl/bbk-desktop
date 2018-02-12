const {app, BrowserWindow, Menu, dialog} = require('electron');
const url = require('url');
const path = require('path');
const {appPass} = require('./config');

const prompt = require('electron-prompt');

let win;

function createWindow() {
    win = new BrowserWindow({show: false, icon: path.join(__dirname, 'assets/icons/png/64x64.png')});
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'browser.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.maximize();
    win.show();
    setMainMenu();
    // win.openDevTools();
}

app.on('ready', createWindow);

function showSettings() {
    prompt({
        title: 'Password',
        label: 'Password:',
        inputAttrs: {
            type: 'password'
        },
        type: 'input',
    })
        .then((r) => {
            console.log('result', r);
            if (r === appPass) {
                showKeyInputDialog()
            } else {
                dialog.showErrorBox('Error', 'Incorrect Password');
            }
        })
        .catch(console.error);
}

function showKeyInputDialog() {
    prompt({
        title: 'Settings',
        label: 'Security Key:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
    })
        .then((r) => {
            console.log('result', r); // null if window was closed, or user clicked Cancel
        })
        .catch(console.error);
}

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
                        // win.webContents.send('settings', 'text......');
                        showSettings();
                    }
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}