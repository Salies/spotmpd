import React from 'react';
import ProgressBar from './Controls/ProgressBar';
import Volume from './Controls/Volume';
import Buttons from './Controls/Buttons';
import NowPlaying from './Controls/NowPlaying';

function Controls(){
    return(
        <div className="controls unselectable">
            <NowPlaying />
            <div className="middle-controls">
                <Buttons />
                <ProgressBar duration="195" />
            </div>
            <Volume default_value="45" />
        </div>
    );
}

export default Controls;