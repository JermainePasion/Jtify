
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { listSongs } from '../../actions/songActions';
import Song from '../Song';
import MusicPlayer from '../MusicPlayer';
import { getUserDetails } from '../../actions/userActions';
import { likeSong } from '../../actions/songActions';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, songs } = useSelector(state => state.songList);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);
  
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

  useEffect(() => {
    return () => {
      pauseSong();
      setCurrentlyPlaying(null);
      setIsPlaying(false);
    };
  }, []);

  const playSong = (song) => {
    if (currentlyPlaying === song && !audioRef.current.paused) {
      pauseSong();
    } else {
      if (currentlyPlaying !== song) {
        audioRef.current.src = song.file;
        setCurrentTime(0); // Reset currentTime when switching to a new song
        setCurrentlyPlaying(song);
        setIsPlaying(true);
      } else {
        audioRef.current.currentTime = currentTime;
      }
      audioRef.current.play();
    }
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    // Do not set currentTime when pausing
  };

  const togglePlayPause = () => {
    if (!currentlyPlaying || audioRef.current.paused) {
      if (!currentlyPlaying) {
        playSong(songs[0]);
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
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        overflowX: 'auto', 
        padding: '10px 0',
        backgroundSize: 'cover',
      }}>
        <h1 style={{ color: 'white', fontFamily: selectedFont, fontSize: '30px' }}>Today's hits</h1>
        <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 0', overflowX: 'auto' }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            songs && songs.map(song => (
              <Song key={song.id} song={song} playSong={playSong} isPlaying={currentlyPlaying === song} selectedFont={selectedFont} />
            ))
          )}
        </div>
        {currentlyPlaying && (
          <MusicPlayer
            currentlyPlaying={currentlyPlaying}
            duration={duration}
            currentTime={currentTime}
            isDragging={isDragging}
            audioRef={audioRef}
            progressBarRef={progressBarRef}
            color={color}
            selectedFont={selectedFont}
            playSong={playSong}
            pauseSong={pauseSong}
            togglePlayPause={togglePlayPause}
            skipTrack={skipTrack}
            formatTime={formatTime}
            handleTimeBarClick={handleTimeBarClick}
            handleTimeBarMouseDown={handleTimeBarMouseDown}
            handleTimeBarMouseUp={handleTimeBarMouseUp}
            calculateTimeBarWidth={calculateTimeBarWidth}
            isPlaying={isPlaying}
          />
        )}
      </div>
    </div>
  );
}

export default Home;