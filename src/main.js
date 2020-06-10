const { app, BrowserWindow, ipcMain } = require('electron'), mpd = require('@salies/mpd.js'), fs = require('fs');

/*
FUNCTIONSS
*/

function createWindow(){
    const mainWindow = new BrowserWindow({
        width:800,
        height:710,
        useContentSize: true,
        webPreferences:{
            nodeIntegration:true
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

let isPlaying = false, 
    stopped = true,
    currentSong = null,
    volume = null,
    config = null;

config = JSON.parse(fs.readFileSync('./userdata/config.json', 'utf8'));

volume = config.user_preferences.volume;

const client = mpd.connect({
    port: config.mpd.port,
    host: config.mpd.url,
});

/* 
APP CALLS
*/

app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin'){
        app.quit();
    }
});

/* 
IPC EVENT LISTENERS 
*/

ipcMain.on('getDefaultData', (event)=>{
    event.sender.send('defaultDataRecieved', {volume});
});
  
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
    if(stopped){
      stopped = false;
      isPlaying = true;
      return client.sendCommand(mpd.cmd(`play`, []), function(err, msg) {
        if (err) throw err;
        console.log(msg);
      });
    }
  
    let p = "0";
    if(isPlaying){
        p = "1";
        isPlaying = false;
    }else if(!isPlaying){
        isPlaying = true;
    }
  
    client.sendCommand(mpd.cmd(`pause ${p}`, []), function(err, msg) {
      if (err) throw err;
      console.log(msg);
    });
});
  
ipcMain.on('setvol', (event, val)=>{
    volume = val;
    client.sendCommand(mpd.cmd(`setvol ${val}`, []));
});
  
client.on('ready', function() {
    console.log("ready");
  
    client.sendCommand(mpd.cmd(`setvol ${volume}`, []));
    
    client.sendCommand(mpd.cmd("status", []), function(err, msg) {
      if (err) throw err;
      let obj = formatStatus(msg);
  
      console.log(obj);
  
      if(obj["state"] == "stop"){
        stopped = true;
      }
      else{
        stopped = false;
        currentSong = obj["song"];
        let b = obj["state"] == "play";
        isPlaying = b;
      }
    });
});
  
client.on('system-player', function() {
    client.sendCommand(mpd.cmd("status", []), function(err, msg) {
      if (err) throw err;
      let obj = formatStatus(msg);
  
      console.log(obj);
  
      if(obj["state"] == "stop"){
        stopped = true;
      }
      else if(obj["state"] == "play" && obj["song"] !== currentSong){
        console.log("mudou a musica!")
  
        client.sendCommand(mpd.cmd('currentsong', []), function(err, msg){
          console.log(msg);
        });
      }
    });
});