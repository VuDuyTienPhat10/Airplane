const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


const path = require('path');
const url = require('url');
const { webContents } = require('electron');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;


let win;
function createWindow() {
    win = new BrowserWindow({
        width: 599,
        height: 599,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // win.loadURL(`file://${__dirname}/views/index.html`);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', function () {
        win = null;
    });



}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
let mang_diem = [];
ipcMain.on('score', (e, data) => {
    let diem_ghi_dc = data;
    mang_diem.push(diem_ghi_dc);
    // dialog.showMessageBox(null, { title: 'gameover', message: `điểm của bạn là ${data}` });

    //nhiệm vụ, viết hàm tìm max của score_Arr 
    let max_diem = TimMax(mang_diem);
    
    if (diem_ghi_dc < max_diem) {
        // dialog.showErrorBox('Bạn chưa phá đc kỉ lục cũ', `kỉ lục cũ là : ${max_diem}`);
        e.sender.send('Chưa phá được kĩ lục cũ', { max_diem, diem_ghi_dc })
    }
    else {
        // dialog.showErrorBox(`Bạn đã phá kĩ lục cũ với số điểm ${max_diem}`, 'Xin chúc mừng!!');
        e.sender.send('đã phá được kĩ lục cũ', { max_diem, diem_ghi_dc })
    }


})
function TimMax(arr) {
    if (arr.length == 0) { return null }
    let max = arr[0];
    for (let x of arr) {
        if (x > max) {
            max = x;
        }
    }
    return max;
}








app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})