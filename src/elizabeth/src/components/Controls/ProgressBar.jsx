import React, { useState, useEffect } from 'react';
import { Slider } from "@reach/slider";
import './ProgressBar.css';

const { ipcRenderer } = window.require('electron');

function ProgressBar({disabled, duration}){
    const [current, setCurrentTime] = useState(0);

    useEffect(() => {
        function handle(event, elapsed) {
            setCurrentTime(elapsed);
        }

        ipcRenderer.on('update-time', handle);

        return () => {
            ipcRenderer.removeListener('update-time', handle);
        };
    });

    return(
        <div className="progressbar-container">
            <Slider disabled={disabled} className="progressbar" min={0} max={Number(duration)} value={Number(current)} step={1} />
        </div>
    );
}

export default ProgressBar;