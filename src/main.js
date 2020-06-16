const { app, BrowserWindow, ipcMain } = require('electron'), mpd = require('@salies/mpd.js'), fs = require('fs'), Timer = require('./utils/Timer');

/*
FUNCTIONSS
*/

let mainWindow
function createWindow(){
    mainWindow = new BrowserWindow({
        width:800,
        height:710,
        useContentSize: true,
        webPreferences:{
            nodeIntegration:true,
            enableRemoteModule: true
        }
    });

    //mainWindow.loadFile('index.html');
    mainWindow.loadURL('http://localhost:3000'); //DEV
}

function formatStatus(msg){
    let s = msg.split("\n"), obj = {};
    s.forEach(function(prop){
      let o = prop.split(": ");
      if(o[1]){
        obj[o[0]] = o[1];
      }
    });
  
    return obj;
}  

/*
GLOBAL (SCOPED TO MAIN) VARIABLES
*/

const nullSong = {
    title:null,
    albumArtist:null,
    id:null,
    duration:0
};

let config, 
    playerData = {
        isPlaying: false, 
        stopped: true
    },
    currentSong = nullSong;

config = JSON.parse(fs.readFileSync('./userdata/config.json', 'utf8'));

global.volume = config.user_preferences.volume;

const client = mpd.connect({
    port: config.mpd.port,
    host: config.mpd.url,
});

let timer = new Timer(function () { //treat it as a sync function?
    client.sendCommand(mpd.cmd("status", []), function(err, msg) {
        if (err) throw err;
        let e = formatStatus(msg);
        mainWindow.webContents.send('update-time', e["elapsed"]);
    });
}, 250)

/* 
APP CALLS
*/

app.whenReady().then(() => {
    console.log('launching window')
    createWindow();
    
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin'){
        timer.pause();
        app.quit();
    }
});

/* 
IPC EVENT LISTENERS 
*/

ipcMain.on('getVolume', (e)=>{
    e.sender.send('volume', {volume});
});

/*ipcMain.on('eae', ()=>{
    mainWindow.webContents.send('salve', 'salve');
})*/

ipcMain.on('getInitialData', (e)=>{ //on, not once, in case of a re-render
    console.log('sending player data');
    e.sender.send('initialData', {playerData, currentSong});
})
  
ipcMain.on('load-list', (event, songs) => {
    console.log(songs)
    songs.forEach(function(song){
      client.sendCommand(mpd.cmd(`add "${song}"`, []), function(err, msg) {
        if (err) throw err;
        console.log(msg);
      });
    });
});
  
ipcMain.on('playback', (event)=>{
    if(playerData.stopped){
        //TODO: ADICIONAR VEFICIAÇÃO DE QUEUE AQUI
        timer.restart();
        playerData.stopped = false;
        playerData.isPlaying = true;
        event.sender.send('update-player', playerData);
        return client.sendCommand(mpd.cmd(`play`, []), function(err, msg) {
            if (err) throw err;
            console.log(msg);
        });
    }
  
    let p = "0";
    if(playerData.isPlaying){
        timer.pause();
        p = "1";
        playerData.isPlaying = false;
    }else if(!playerData.isPlaying){
        timer.resume();
        playerData.isPlaying = true;
    }
  
    client.sendCommand(mpd.cmd(`pause ${p}`, []), function(err, msg) {
      if (err) throw err;
      console.log(msg);
    });

    event.sender.send('update-player', playerData);
});
  
ipcMain.on('setvol', (event, val)=>{
    global.volume = val;
    client.sendCommand(mpd.cmd(`setvol ${val}`, []));
});

ipcMain.on('next', ()=>{
    mainWindow.webContents.send('update-time', 0);
    client.sendCommand(mpd.cmd('next', []));
});

ipcMain.on('previous', ()=>{
    mainWindow.webContents.send('update-time', 0);
    client.sendCommand(mpd.cmd('previous', []));
})

ipcMain.on('repeat', (event, val)=>{
    console.log('chamou repeat ' + val)
    let r = "1";
    if(val == 0){
        r = "0";
        client.sendCommand(mpd.cmd('single 0', []));
    }else if(val == 2){
        client.sendCommand(mpd.cmd('single 1', []));
    }

    client.sendCommand(mpd.cmd(`repeat ${r}`, []));
})

ipcMain.on('shuffle', (event, val)=>{
    console.log('chamou shuffle ' + val)
    client.sendCommand(mpd.cmd(`random ${val}`, []));
})
  
client.on('ready', function() {
    console.log("ready");
  
    client.sendCommand(mpd.cmd(`setvol ${global.volume}`, []));
    
    client.sendCommand(mpd.cmd("status", []), function(err, msg) {
      if (err) throw err;
      let obj = formatStatus(msg);

      if(obj["repeat"] != 0){
            console.log('repeat não é 0, setando...')
            client.sendCommand(mpd.cmd(`repeat 0`, []));
      }
  
      currentSong.duration = obj["duration"];

      console.log(obj);

        if(obj["state"] !== "stop"){
            timer.start();
            playerData.stopped = false;
            currentSong.id = obj["songid"];
            client.sendCommand(mpd.cmd('currentsong', []), function(err, songInfo){
                let s = formatStatus(songInfo);
                currentSong.title = s["Title"];
                currentSong.albumArtist = s["AlbumArtist"];
                let b = obj["state"] == "play";
                playerData.isPlaying = b;
                mainWindow.webContents.send('update-player', playerData);
                mainWindow.webContents.send('update-song', currentSong);
                if(obj["state"] == "pause"){
                    mainWindow.webContents.send('update-time', obj["elapsed"]);
                }
            });
            /*let b = obj["state"] == "play";
            playerData.isPlaying = b;*/
      }
    });
});
  
client.on('system-player', function() {
    client.sendCommand(mpd.cmd("status", []), function(err, msg) {
        if (err) throw err;
        let obj = formatStatus(msg);

        console.log(obj);

        currentSong.duration = obj["duration"];
  
        if(obj["state"] == "stop"){
            timer.restart();
            playerData.stopped = true;
            playerData.isPlaying = false;
            currentSong = nullSong;
            mainWindow.webContents.send('update-player', playerData);
            mainWindow.webContents.send('update-song', currentSong); //TODO (ISSUE) - NOT REALLY ERASING DATA, SEE WHY
        }
        else if(obj["state"] == "play" && obj["songid"] !== currentSong.id){
            console.log("mudou a musica!")

            timer.restart();
    
            currentSong.id = obj["songid"];

            client.sendCommand(mpd.cmd('currentsong', []), function(err, songInfo){
                let s = formatStatus(songInfo);
                currentSong.title = s["Title"];
                currentSong.albumArtist = s["AlbumArtist"];
                mainWindow.webContents.send('update-player', playerData);
                mainWindow.webContents.send('update-song', currentSong);
            });
        }
    });
});