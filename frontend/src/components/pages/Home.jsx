import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { listSongs, searchSongs } from '../../actions/songActions';
import Song from '../Song';
import MusicPlayer from '../MusicPlayer';
import { getUserDetails } from '../../actions/userActions';
import { BsSearch } from 'react-icons/bs';
import { playlistView } from '../../actions/songActions';
import Playlist from '../Playlist'; // Import Playlist component

function Home() {
  const dispatch = useDispatch();
  const { loading, error, songs, playlists } = useSelector(state => state.songList);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [query, setQuery] = useState('');
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  console.log("Songs:", songs);
  console.log("Playlists:", playlists);

  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(listSongs());
    dispatch(playlistView());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(searchSongs(query));
    }, 500);

    return () => {
      clearTimeout(timer);
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
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    dispatch(searchSongs(query));
  };

  const playSong = (song) => {
    if (currentlyPlaying === song && !audioRef.current.paused) {
      pauseSong();
    } else {
      if (currentlyPlaying !== song) {
        audioRef.current.src = song.file;
        setCurrentTime(0);
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
        <div style={{ position: 'absolute', top: '10px', right: '30px' }}>
          <div style={{ position: 'absolute', top: '10px', right: '30px', display: 'flex', alignItems: 'center' }}>
            <div className="input-group rounded">
              <input
                type="search"
                className="form-control rounded pl-5"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-addon"
                value={query}
                onChange={handleSearchChange}
                style={{
                  position: 'relative',
                  transition: 'width 0.3s ease-in-out',
                  width: '300px',
                  paddingLeft: '30px'
                }}
                onFocus={(e) => e.target.style.width = '600px'}
                onBlur={(e) => e.target.style.width = '300px'}
              />
              <div className="input-group-append">
                <span className="input-group-text border-0" id="search-addon">
                  <BsSearch
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-search"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <h1 style={{ color: 'white', fontFamily: selectedFont, fontSize: '30px' }}>Today's hits</h1>
        <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 0', overflowX: 'hidden',  transition: 'overflow-x 0.5s' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.overflowX = 'auto';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.overflowX = 'hidden';
          }} >
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          // Filter songs based on the search query and then map
          songs.filter(song => song.name.toLowerCase().includes(query.toLowerCase()) || song.artist.toLowerCase().includes(query.toLowerCase()))
              .map(song => (
            <Song key={song.id} song={song} playSong={playSong} isPlaying={currentlyPlaying === song} selectedFont={selectedFont} />
          ))
        )}
      </div>
      <h2 style={{ color: 'white', fontFamily: selectedFont, fontSize: '30px' }}>Playlists</h2>
      <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 0', overflowX: 'hidden',  transition: 'overflow-x 0.5s' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.overflowX = 'auto';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.overflowX = 'hidden';
          }} >
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          // Filter playlists based on the search query and then map
          playlists.filter(playlist => playlist.name.toLowerCase().includes(query.toLowerCase()))
                  .map(playlist => (
            <Playlist key={playlist.id} playlist={playlist} />
          ))
        )}
      </div>
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
  );
}

export default Home;