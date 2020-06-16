import React, { useState, useEffect } from 'react';
import ProgressBar from './Controls/ProgressBar';
import Buttons from './Controls/Buttons';
import NowPlaying from './Controls/NowPlaying';

const { ipcRenderer } = window.require('electron');

function callIpc(call, val){
    ipcRenderer.send(call, val);
}

function Controls({initial}){
    const [playerData, setPlayerData] = useState(initial.playerData);
    const [songData, setSongData] = useState(initial.currentSong);

    useEffect(() => {
        function handlePlayerDataChange(event, data) {
          setPlayerData(data);
        }

        function handleSongDataChange(event, data){
            console.log(data);
            setSongData(data);
        }

        ipcRenderer.on('update-player', handlePlayerDataChange);
        ipcRenderer.on('update-song', handleSongDataChange);

        return () => {
            ipcRenderer.removeListener('update-player', handlePlayerDataChange);
            ipcRenderer.removeListener('update-song', handleSongDataChange);
        };
    });

    console.log(playerData)

    return(
        <div>
            <NowPlaying song={songData.title} artist={songData.albumArtist}/>
            <div className="middle-controls">
                <Buttons callback={callIpc} playing={playerData.isPlaying}/>
                <ProgressBar duration={songData.duration} disabled={playerData.stopped} />
            </div>
        </div>
    );
}

export default Controls;