import React from 'react';

const { ipcRenderer } = window.require('electron');

const songs = [
    "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 07 Pirate's Scorn.flac",
    "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 08 Shit Boat (No Fans).flac",
    "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 09 Pirate Metal Drinking Crew.flac"
];

function Home(){
    return(
        <div>
            <button onClick={()=> ipcRenderer.send('load-list', songs)}>Load Songs</button>
            <button onClick={()=> ipcRenderer.send('start-timer')}>Start Timer</button>
            <button onClick={()=> ipcRenderer.send('resume-timer')}>Resume Timer</button>
            <button onClick={()=> ipcRenderer.send('pause-timer')}>Pause Timer</button>
            <button onClick={()=> ipcRenderer.send('restart-timer')}>Restart Timer</button>
        </div>
    );
}

export default Home;