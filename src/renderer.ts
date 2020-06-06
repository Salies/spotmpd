import { ipcRenderer, ipcMain } from 'electron';

let isPlaying: boolean = false, stopped: boolean = true;

ipcRenderer.send('load-list', [
    "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 07 Pirate's Scorn.flac",
    "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 08 Shit Boat (No Fans).flac",
    "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 09 Pirate Metal Drinking Crew.flac",
]);

function playback(){
    ipcRenderer.send('playback');
}