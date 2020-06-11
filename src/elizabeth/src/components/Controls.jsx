import React, { useState, useEffect } from 'react';
import ProgressBar from './Controls/ProgressBar';
import Buttons from './Controls/Buttons';
import NowPlaying from './Controls/NowPlaying';

const { ipcRenderer } = window.require('electron');

function callIpc(call){
    ipcRenderer.send(call);
}

function Controls({initial}){
    const [playerData, setPlayerData] = useState(initial);

    useEffect(() => {
        function handleDataChange(event, data) {
          setPlayerData(data);
        }

        ipcRenderer.on('update-player', handleDataChange);

        return () => {
            ipcRenderer.removeListener('update-player', handleDataChange);
        };
    });

    console.log(playerData)

    return(
        <div>
            <NowPlaying song={playerData.currentSong.title} artist={playerData.currentSong.albumArtist}/>
            <div className="middle-controls">
                <Buttons callback={callIpc} playing={playerData.isPlaying}/>
                <ProgressBar duration="195" disabled={playerData.stopped} />
            </div>
        </div>
    );
}

export default Controls;