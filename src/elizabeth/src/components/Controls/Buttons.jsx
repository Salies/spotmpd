import React from 'react';
import { PlayCircle, PauseCircle, SkipBack, SkipForward, Repeat, Shuffle } from 'react-feather';

function Buttons({callback, playing}){
    return(
        <div className="player-buttons">
            <Shuffle size={14}/>
            <SkipBack size={20}/>
            <span onClick={()=> callback('playback')}>{playing ? <PauseCircle  size={36}/> : <PlayCircle size={36}/>}</span>
            <SkipForward size={20}/>
            <Repeat size={14}/>
        </div>
    );
}

export default Buttons;