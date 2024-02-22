import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { listSongs, searchSongs } from '../../actions/songActions';
import Song from '../Song';
import MusicPlayer from '../MusicPlayer';
import { getUserDetails } from '../../actions/userActions';

function Home() {
  const dispatch = useDispatch();
  const { loading, error, songs } = useSelector(state => state.songList);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [query, setQuery] = useState(''); // Define query state variable
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(listSongs());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Dispatch searchSongs action after 500ms of typing inactivity
      dispatch(searchSongs(query));
    }, 500);

    return () => {
      clearTimeout(timer); // Clear the timeout on cleanup
    };
  }, [query, dispatch]);

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

  const handleSearchChange = (e) => {
    setQuery(e.target.value); // Define handleSearchChange function
  };

  const handleSearch = () => {
    // Dispatch searchSongs action immediately when the search button is clicked
    dispatch(searchSongs(query));
  };

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
        padding: '10px 20px', // Increase padding for better spacing
        backgroundSize: 'cover',
      }}>
        <div style={{ position: 'absolute', top: '10px', right: '20px' }}> {/* Position search bar */}
          {/* Search bar with Bootstrap classes */}
          <div className="input-group rounded">
            <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" value={query} onChange={handleSearchChange} />
            {/* <button className="btn btn-primary" type="button" id="search-addon" onClick={handleSearch}>Search</button> */}
          </div>
        </div>
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
