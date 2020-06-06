import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

const mpd = require("@salies/mpd.js"), PORT = "6600", URL = "localhost";

let mainWindow: Electron.BrowserWindow, 
    client = mpd.connect({
      port: PORT,
      host: URL,
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 710,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    }
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  //mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function formatStatus(msg: string){
  let s:Array<string> = msg.split("\n"), obj: any = {};
  s.forEach(function(prop: string){
    let o = prop.split(": ");
    if(o[1]){
      obj[o[0]] = o[1];
    }
  });

  return obj;
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/*
  CONTROL VARS
*/
let volume: number;


/* 
  SIGNALS
*/

client.on('ready', function() {
  console.log("ready");
  
  client.sendCommand(mpd.cmd("status", []), function(err: any, msg: string) {
    if (err) throw err;
    let obj: any = formatStatus(msg);

    if(obj["state"] == "stop"){
      stopped = true;
    }
  });
});

ipcMain.on('load-list', (event, songs: Array<string>) => {
 songs.forEach(function(song: string){
  client.sendCommand(mpd.cmd(`add "${song}"`, []), function(err: any, msg: string) {
    if (err) throw err;
    console.log(msg);
  });
 });
});

/*ipcMain.on('play', (event)=>{
  client.sendCommand(mpd.cmd(`play`, []), function(err: any, msg: string) {
    if (err) throw err;
    console.log(msg);
  });
});*/

let isPlaying: boolean = false, stopped: boolean = true;
ipcMain.on('playback', (event)=>{
  if(stopped){
    stopped = false;
    isPlaying = true;
    return client.sendCommand(mpd.cmd(`play`, []), function(err: any, msg: string) {
      if (err) throw err;
      console.log(msg);
    });
  }

  let p: string = "0";
  if(isPlaying){
      p = "1";
      isPlaying = false;
  }else if(!isPlaying){
      isPlaying = true;
  }

  client.sendCommand(mpd.cmd(`pause ${p}`, []), function(err: any, msg: string) {
    if (err) throw err;
    console.log(msg);
  });
});

client.on('system-player', function() {
  client.sendCommand(mpd.cmd("status", []), function(err: any, msg: string) {
    if (err) throw err;
    let obj: any = formatStatus(msg);

    if(obj["state"] == "stop"){
      stopped = true;
    }
  });
});

/*
TODO:
implementar react
começar indexer
*/