import React, { useState } from 'react';
import { Slider } from "@reach/slider";
import { Volume as Volume0, Volume1, Volume2, VolumeX } from 'react-feather';

const I_SIZE = 20;

function Volume({default_value}){
    const [vol, setVol] = useState(default_value);
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
            <Slider disabled={mute} className="volume" defaultValue={Number(default_value)} min={0} max={100} step={1} onChange={setVol} />
        </div>
    );
}

export default Volume;