const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const prompt = require('electron-prompt');

const fileName = './config.json';
const file = require(fileName);
const configObj = JSON.parse(fs.readFileSync('config.json', 'utf8'));

let win;

function createWindow() {
    win = new BrowserWindow({show: false, icon: path.join(__dirname, 'assets/icons/png/64x64.png')});
    let fileToLoad = 'browser.html';
    if (!file.appKey) {
        fileToLoad = 'not-config.html';
    }
    win.loadURL(url.format({
        pathname: path.join(__dirname, fileToLoad),
        protocol: 'file:',
        slashes: true
    }));
    win.maximize();
    win.show();
    setMainMenu();
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
            if (r === configObj.appPass) {
                showKeyInputDialog(r)
            } else {
                dialog.showErrorBox('Error', 'Incorrect Password');
            }
        })
        .catch(console.error);
}

function showKeyInputDialog(password) {
    prompt({
        title: 'Settings',
        label: 'Security Key:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
    })
        .then((key) => {
            file.appKey = key;
            fs.writeFile(fileName, JSON.stringify(file), function (err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
                win.webContents.send('key-update', 'update');
            })
        })
        .catch(console.error);
}

function setMainMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Settings',
                    accelerator: 'CmdOrCtrl+H',
                    click() {
                        showSettings();
                    }
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.on('refresh', (event, arg) => {
    let old = win;
    createWindow();
    old.close();
});