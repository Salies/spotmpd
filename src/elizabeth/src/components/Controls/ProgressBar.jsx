import React, { useState } from 'react';
import { Slider } from "@reach/slider";
import './ProgressBar.css';

function toMSS(seconds){
    let m = Math.floor(seconds / 60),
        s = seconds - m * 60;

    if(Math.floor(s / 10) === 0){
        s = `0${s}`;
    }

    return `${m}:${s}`;
}

function ProgressBar({disabled, duration}){
    const [current, setCurrentTime] = useState(0);

    return(
        <div className="progressbar-container">
            <span>{ toMSS(current) }</span>
            <Slider disabled={disabled} className="progressbar" min={0} max={Number(duration)} value={current} onChange={setCurrentTime} step={1} />
            <span>{ toMSS(duration) }</span>
        </div>
    );
}

export default ProgressBar;