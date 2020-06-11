import React from 'react';

function NowPlaying({song, artist, cover}){
    return(
        <div className="now-playing">
            <div className="now-playing-cover"></div>
            <div className="song-strings">
                <span className="now-playing-song">{song}</span>
                <span className="now-playing-artist">{artist}</span>
            </div>
        </div>
    );
}

export default NowPlaying;