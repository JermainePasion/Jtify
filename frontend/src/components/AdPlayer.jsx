import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import { BiRepeat } from 'react-icons/bi';
import Slider from '@mui/material/Slider';

function AdPlayer({ currentAd, handleAdFinish, selectedFont, currentlyPlaying }) {
  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem('volume');
    return storedVolume !== null ? parseInt(storedVolume, 10) : 50;
  });
  const [isPlaying, setIsPlaying] = useState(true); // Default to true for autoplay
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    const audio = document.getElementById("ad-audio");

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    const audio = document.getElementById("ad-audio");
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const toggleMute = () => {
    const audio = document.getElementById("ad-audio");
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    const audio = document.getElementById("ad-audio");
    audio.volume = newValue / 100;
    setIsMuted(newValue === 0);
  };

  const handleSeek = (event, newValue) => {
    const audio = document.getElementById("ad-audio");
    const newTime = (newValue / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#282828', color: '#fff', boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', borderTop: '1px solid #535353' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={currentAd.image} alt="img" style={{ width: '64px', height: '64px', marginRight: '20px', borderRadius: '4px' }} />
          <div>
              <p style={{ margin: 0, fontWeight: 'bold', fontFamily: selectedFont, fontSize: '16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Jtify</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#b3b3b3' }}>Advertisement</p>
          </div>
          <button onClick={togglePlayPause} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff', marginBottom: '20px', position: 'fixed', left: '50%', transform: 'translateX(-50%)' }}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff', marginBottom: '20px', position: 'fixed', left: '47.5%', transform: 'translateX(-50%)' }}>
            <FaStepBackward />
          </button>
          <button style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff', marginBottom: '20px', position: 'fixed', left: '52.5%', transform: 'translateX(-50%)' }}>
            <FaStepForward />
          </button>
          <button style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff', marginBottom: '20px', position: 'fixed', left: '55%', transform: 'translateX(-50%)' }}>
              <FaRandom style={{ color: isShuffle ? '#8a63d2' : '#fff' }} />
          </button>
          <button style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff', marginBottom: '20px', position: 'fixed', left: '45%', transform: 'translateX(-50%)' }}>
              {isRepeat ? <BiRepeat style={{ color: '#8a63d2' }} /> : <BiRepeat style={{ color: '#fff' }} />}
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <audio id="ad-audio" src={currentAd.audio} type="audio/mp3" controls autoPlay onEnded={handleAdFinish} style={{ display: 'none' }}>
  Your browser does not support the audio tag.
</audio>
          <Slider
            value={progress || 0}
            onChange={handleSeek}
            aria-labelledby="continuous-slider"
          
            disabled // Set the Slider to disabled
          />
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
    </div>
  );
}

export default AdPlayer;
