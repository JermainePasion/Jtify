import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Slider from '@mui/material/Slider';

function MusicPlayer({
  currentlyPlaying,
  duration,
  currentTime,
  audioRef,
  color,
  selectedFont,
  playSong,
  pauseSong,
  skipTrack,
  formatTime,
}) {
  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem('volume');
    return storedVolume !== null ? parseInt(storedVolume, 10) : 50;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const storedIsPlaying = localStorage.getItem('isPlaying') === 'true';
    setIsPlaying(storedIsPlaying);

    const handlePlay = () => {
      setIsPlaying(true);
      localStorage.setItem('isPlaying', 'true');
    };

    const handlePause = () => {
      setIsPlaying(false);
      localStorage.setItem('isPlaying', 'false');
    };

    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);

    return () => {
      audioRef.current.removeEventListener('play', handlePlay);
      audioRef.current.removeEventListener('pause', handlePause);
    };
  }, [audioRef]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
    localStorage.setItem('volume', volume.toString());
    setIsMuted(volume === 0);
  }, [volume]);

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleTimeBarChange = (event, newValue) => {
    const newTime = (newValue / 100) * duration;
    audioRef.current.currentTime = newTime;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong(currentlyPlaying);
    }
  };

  const toggleMute = () => {
    const newVolume = isMuted ? 50 : 0;
    setVolume(newVolume);
  };

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#282828', color: '#fff', boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderTop: '1px solid #535353' }}>
        {currentlyPlaying && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={currentlyPlaying.picture} alt="Album Art" style={{ width: '64px', height: '64px', marginRight: '20px', borderRadius: '4px' }} />
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', fontFamily: selectedFont, fontSize: '16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentlyPlaying.name}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#b3b3b3' }}>{currentlyPlaying.artist}</p>
            </div>
          </div>
        )}
        <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
          <button onClick={() => skipTrack(false)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
            <FaStepBackward />
          </button>
          <button onClick={togglePlayPause} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '32px', color: '#fff' }}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={() => skipTrack()} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
            <FaStepForward />
          </button>
        </div>
        {duration > 0 && (
          <div 
            style={{ 
              position: 'absolute', 
              bottom: '3px',
              left: '50%', 
              transform: 'translateX(-50%)',
              width: '40%', 
              cursor: 'pointer',
              margin: 'auto',
            }}
          >
            <Slider
              value={(currentTime / duration) * 100}
              onChange={handleTimeBarChange}
              aria-labelledby="continuous-slider"
              style={{ color: '#fff', width: '100%' }}
            />
            <div 
              style={{ 
                color: '#b3b3b3', 
                fontSize: '14px', 
                textAlign: 'left', 
                position: 'absolute', 
                left: '0', 
                top: '-20px' 
              }}
            >
              {formatTime(currentTime)}
            </div>
            <div 
              style={{ 
                color: '#b3b3b3', 
                fontSize: '14px', 
                textAlign: 'right', 
                position: 'absolute', 
                right: '0', 
                top: '-20px' 
              }}
            >
              {formatTime(duration)}
            </div>
          </div>
        )}
        <div style={{ position: 'fixed', right: '20px', bottom: '20px', display: 'flex', alignItems: 'center' }}>
          <button onClick={toggleMute} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '20px', color: '#fff' }}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="continuous-slider"
            style={{ color: '#fff', width: '100px', '& .MuiSlider-thumb': { width: 20, height: 20 } }} // Adjust width and height of the thumb here
          />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;