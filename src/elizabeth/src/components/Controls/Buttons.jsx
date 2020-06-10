import React from 'react';
import { PlayCircle, SkipBack, SkipForward, Repeat, Shuffle } from 'react-feather';

function Buttons(){
    return(
        <div className="player-buttons">
            <Shuffle/>
            <SkipBack/>
            <PlayCircle/>
            <SkipForward/>
            <Shuffle/>
        </div>
    );
}

export default Buttons;