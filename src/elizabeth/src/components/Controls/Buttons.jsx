import React, { useState } from 'react';
import { PlayCircle, PauseCircle, SkipBack, SkipForward, Repeat, Shuffle } from 'react-feather';

function Buttons({callback, playing}){
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(0);

    //TODO FIX: NEITHER SHUFFLE NOR REPEAT WORK

    return(
        <div className="player-buttons">
            <Shuffle onClick={()=>{
                callback('shuffle', Number(!shuffle))
                setShuffle(!shuffle)
            }} size={14} style={{stroke:shuffle ? 'var(--pink)' : 'currentColor'}}/>
            <SkipBack onClick={()=> callback('previous')} size={20}/>
            <span onClick={()=> callback('playback')}>{playing ? <PauseCircle  size={36}/> : <PlayCircle size={36}/>}</span>
            <SkipForward onClick={()=> callback('next')} size={20}/>
            <div className="repeat">
            <Repeat onClick={()=>{
                let r = repeat;
                if(r === 2){
                    r = 0;
                } 
                else{
                    r++;
                }

                callback('repeat', r);
                setRepeat(r);
            }} size={14} style={{stroke:repeat ? 'var(--pink)' : 'currentColor'}}/>
            <div className="repeat-one" style={{display: repeat === 2 ? 'block' : 'none'}}>1</div>
            </div>
        </div>
    );
}

export default Buttons;