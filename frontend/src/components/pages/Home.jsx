import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { listSongs } from '../../actions/songActions';
import Song from '../Song';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

function Home() {
  const dispatch = useDispatch();
  const { loading, error, songs } = useSelector(state => state.songList);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [resumePlay, setResumePlay] = useState(false);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  
  useEffect(() => {
    dispatch(listSongs());
  }, [dispatch]);

  useEffect(() => {
    audioRef.current.addEventListener('timeupdate', () => {
      if (!isDragging) {
        setCurrentTime(audioRef.current.currentTime);
      }
    });
    audioRef.current.addEventListener('durationchange', () => {
      setDuration(audioRef.current.duration);
    });
    return () => {
      audioRef.current.removeEventListener('timeupdate', () => {
        if (!isDragging) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      audioRef.current.removeEventListener('durationchange', () => {
        setDuration(audioRef.current.duration);
      });
    };
  }, [isDragging]);

  const playSong = (song) => {
    if (currentlyPlaying === song && !audioRef.current.paused) {
      pauseSong();
    } else {
      audioRef.current.src = song.file;
      if (resumePlay) {
        audioRef.current.currentTime = currentTime;
      }
      audioRef.current.play();
      setCurrentlyPlaying(song);
      setResumePlay(false);
    }
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setResumePlay(true);
  };

  const togglePlayPause = () => {
    if (!currentlyPlaying || audioRef.current.paused) {
      if (!currentlyPlaying) {
        playSong(songs[0]); // Start playing the first song if none is currently playing
      } else {
        playSong(currentlyPlaying);
      }
    } else {
      pauseSong();
    }
  };

  const skipTrack = (forward = true) => {
    const currentIndex = songs.findIndex(song => song === currentlyPlaying);
    let newIndex = currentIndex + (forward ? 1 : -1);
    if (newIndex < 0) {
      newIndex = songs.length - 1;
    } else if (newIndex >= songs.length) {
      newIndex = 0;
    }
    playSong(songs[newIndex]);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeBarClick = (e) => {
    const clickedPosition = e.clientX - progressBarRef.current.getBoundingClientRect().left;
    const timePerPixel = duration / progressBarRef.current.offsetWidth;
    const newCurrentTime = clickedPosition * timePerPixel;
    audioRef.current.currentTime = newCurrentTime;
    setCurrentTime(newCurrentTime);
  };

  const handleTimeBarMouseDown = () => {
    setIsDragging(true);
  };

  const handleTimeBarMouseUp = () => {
    setIsDragging(false);
  };

  const calculateTimeBarWidth = () => {
    if (duration) {
      return (currentTime / duration) * 100 + '%';
    } else {
      return '0%';
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
      <Navbar />
      <div style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        backgroundColor: 'black', 
        overflowX: 'auto', 
        padding: '10px 0',
        backgroundImage: `url(${process.env.PUBLIC_URL}/HomeBg.png)`,
        backgroundSize: 'cover',
      }}>
        <h1 style={{ color: 'white', fontFamily: 'Verdana', paddingLeft: '15px', fontSize: '30px', }}>Today's hits</h1>
        <div className="homepage-background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
        <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 0', overflowX: 'auto' }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            songs && songs.map(song => (
              <Song key={song.id} song={song} playSong={playSong} isPlaying={currentlyPlaying === song} />
            ))
          )}
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#282828', color: '#fff', boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderTop: '1px solid #535353' }}>
            {currentlyPlaying && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={currentlyPlaying.picture} alt="Album Art" style={{ width: '64px', height: '64px', marginRight: '20px', borderRadius: '4px' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontFamily: 'Helvetica Neue', fontSize: '16px' }}>{currentlyPlaying.name}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#b3b3b3' }}>{currentlyPlaying.artist}</p>
                </div>
              </div>
            )}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <button onClick={() => skipTrack(false)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff', marginRight: '20px' }}>
                <FaStepBackward />
              </button>
              <button onClick={togglePlayPause} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '32px', color: '#fff', marginRight: '20px' }}>
                {currentlyPlaying && !audioRef.current.paused ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={() => skipTrack()} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff', marginRight: '20px' }}>
                <FaStepForward />
              </button>
            </div>
            {duration > 0 && (
              <div 
                ref={progressBarRef} 
                style={{ 
                  position: 'absolute', 
                  bottom: '10px',
                  left: 0, 
                  height: '4px', 
                  backgroundColor: '#535353', 
                  width: '100%',
                  cursor: 'pointer',
                  margin: 'auto'
                }}
                onClick={handleTimeBarClick}
                onMouseDown={handleTimeBarMouseDown}
                onMouseUp={handleTimeBarMouseUp}
              >
                <div style={{ height: '100%', width: calculateTimeBarWidth(), backgroundColor: '#A257D2' }} />
              </div>
            )}
            <div style={{ color: '#b3b3b3', fontSize: '14px', minWidth: '50px', marginLeft: '5px', textAlign: 'center' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;