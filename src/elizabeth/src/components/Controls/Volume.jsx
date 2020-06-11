import React, { useState } from 'react';
import { Slider } from "@reach/slider";
import { Volume as Volume0, Volume1, Volume2, VolumeX } from 'react-feather';

const I_SIZE  = 20, { remote, ipcRenderer } =  window.require('electron'), initv = remote.getGlobal('volume');

function Volume(){
    const [vol, setVol] = useState(initv);
    const [mute, setMute] = useState(false);
    let v;

    if(mute){
        v = <VolumeX size={I_SIZE} />
    }
    else if(vol === 0){
        v = <Volume0 size={I_SIZE} />
    }
    else if( vol < 50){
        v = <Volume1 size={I_SIZE} />
    }
    else{ //>= 50
        v = <Volume2 size={I_SIZE} />
    }
    return(
        <div className="volume-container">
            <div className="s" onClick={()=> setMute(!mute)}>{ v }</div>
            <Slider disabled={mute} className="volume" defaultValue={Number(initv)} min={0} max={100} step={1} onChange={(value)=>{
                ipcRenderer.send('setvol', value);
                setVol(value);
            }} />
        </div>
    );
}

export default Volume;