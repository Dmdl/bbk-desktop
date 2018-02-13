// import {app, BrowserWindow, Menu, ipcMain} from 'electron';
//
// const url = require('url');
// const path = require('path');
// const fs = require('fs');
// const prompt = require('electron-prompt');
//
// const fileName = '../config.json';
// const file = require(fileName);
// const configObj = JSON.parse(fs.readFileSync('config.json', 'utf8'));
//
// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
//     app.quit();
// }
//
// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let mainWindow;
//
// const createWindow = () => {
//     // Create the browser window.
//     mainWindow = new BrowserWindow({
//         show: false,
//         icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
//     });
//
//     // load the not-config.html or browser.html based on settings
//     if (!file.appKey) {
//         mainWindow.loadURL(`file://${__dirname}/not-config.html`);
//     } else {
//         mainWindow.loadURL(`file://${__dirname}/browser.html`);
//     }
//
//     // Open the DevTools.
//     mainWindow.webContents.openDevTools();
//
//     // Emitted when the window is closed.
//     mainWindow.on('closed', () => {
//         mainWindow = null;
//     });
//     mainWindow.maximize();
//     mainWindow.show();
//     setMainMenu();
// };
//
// app.on('ready', createWindow);
//
// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//     // On OS X it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });
//
// // app.on('activate', () => {
// //     // On OS X it's common to re-create a window in the app when the
// //     // dock icon is clicked and there are no other windows open.
// //     if (mainWindow === null) {
// //         createWindow();
// //     }
// // });
//
// function showSettings() {
//     prompt({
//         title: 'Password',
//         label: 'Password:',
//         inputAttrs: {
//             type: 'password'
//         },
//         type: 'input',
//     })
//         .then((r) => {
//             if (r === configObj.appPass) {
//                 showKeyInputDialog(r)
//             } else {
//                 dialog.showErrorBox('Error', 'Incorrect Password');
//             }
//         })
//         .catch(console.error);
// }
//
// function showKeyInputDialog(password) {
//     prompt({
//         title: 'Settings',
//         label: 'Security Key:',
//         inputAttrs: {
//             type: 'text'
//         },
//         type: 'input',
//     })
//         .then((key) => {
//             file.appKey = key;
//             fs.writeFile('./config.json', JSON.stringify(file), function (err) {
//                 if (err) return console.log(err);
//                 console.log(JSON.stringify(file));
//                 console.log('writing to ' + fileName);
//                 //mainWindow.webContents.send('key-update', 'update');
//             })
//         })
//         .catch(console.error);
// }
//
// function setMainMenu() {
//     const template = [
//         {
//             label: 'File',
//             submenu: [
//                 {
//                     label: 'Settings',
//                     accelerator: 'CmdOrCtrl+H',
//                     click() {
//                         showSettings();
//                     }
//                 }
//             ]
//         }
//     ];
//     Menu.setApplicationMenu(Menu.buildFromTemplate(template));
// }
//
// ipcMain.on('refresh', (event, arg) => {
//     let old = mainWindow;
//     createWindow();
//     old.close();
// });

const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const prompt = require('electron-prompt');

const fileName = './config.json';
const file = require(fileName);
const configObj = JSON.parse(fs.readFileSync('src/config.json', 'utf8'));

let win;

// https://github.com/electron-userland/electron-forge

function createWindow() {
    win = new BrowserWindow({show: false, icon: path.join(__dirname, '../assets/icons/png/64x64.png')});
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
            fs.writeFile('./src/config.json', JSON.stringify(file), function (err) {
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