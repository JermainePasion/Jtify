import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaRandom } from 'react-icons/fa';
import { BiRepeat } from 'react-icons/bi';
import Slider from '@mui/material/Slider';

function MusicPlayer({
  currentlyPlaying,
  audioRef,
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

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

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audioRef.current.duration);
    };

    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('durationchange', handleDurationChange);

    return () => {
      audioRef.current.removeEventListener('play', handlePlay);
      audioRef.current.removeEventListener('pause', handlePause);
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('durationchange', handleDurationChange);
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
    setCurrentTime(newTime);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const newVolume = isMuted ? 50 : 0;
    setVolume(newVolume);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    // Implement shuffle logic here
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    // Implement repeat logic here
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
          <button onClick={toggleRepeat} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
            {isRepeat ? <BiRepeat style={{ color: '#8a63d2' }} /> : <BiRepeat style={{ color: '#fff' }} />}
          </button>
          <button onClick={() => skipTrack(false)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
            <FaStepBackward />
          </button>
          <button onClick={togglePlayPause} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '32px', color: '#fff' }}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={() => skipTrack()} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
            <FaStepForward />
          </button>
          <button onClick={toggleShuffle} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
            <FaRandom style={{ color: isShuffle ? '#8a63d2' : '#fff' }} />
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
            style={{ color: '#fff', width: '100px', '& .MuiSlider-thumb': { width: 20, height: 20 } }}
          />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;