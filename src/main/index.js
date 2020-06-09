import { app, BrowserWindow, ipcMain } from 'electron'
import * as fs from 'fs'
import * as mpd from '@salies/mpd.js'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let isPlaying = false, 
    stopped = true,
    currentSong = null,
    volume = 50,
    config = null;

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

config = JSON.parse(fs.readFileSync('./userdata/config.json', 'utf8'));

const client = mpd.connect({
    port: config.mpd.port,
    host: config.mpd.url,
});

volume = config.user_preferences.volume;

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 710,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
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

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if(volume != config.user_preferences.volume){
    config.user_preferences.volume = volume;
    fs.writeFile('./userdata/config.json', JSON.stringify(config), 'utf8', ()=>{
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });
  }
  else if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

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


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
