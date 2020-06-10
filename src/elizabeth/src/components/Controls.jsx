import React from 'react';
import ProgressBar from './Controls/ProgressBar';
import Volume from './Controls/Volume';

function Controls(){
    return(
        <div className="controls unselectable">
            <ProgressBar duration="180" />
            <Volume default_value="45" />
        </div>
    );
}

export default Controls;