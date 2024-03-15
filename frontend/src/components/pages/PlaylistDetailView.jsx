import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Spinner, Image } from 'react-bootstrap'; // Import Image from react-bootstrap
import { playlistDetailView } from '../../actions/songActions';
import { getUserDetails } from '../../actions/userActions';
import Navbar from '../Navbar';
import Song from '../Song';
import MusicPlayer from '../MusicPlayer';

const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, playlist, error } = useSelector((state) => state.playlistDetail);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  // State declarations moved inside the functional component
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);

  useEffect(() => {
    console.log('Fetching playlist details...');
    dispatch(getUserDetails());
    dispatch(playlistDetailView(id));
  }, [dispatch, id]);

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
        playSong(playlist.songs[0]); // Changed songs to playlist.songs
      } else {
        playSong(currentlyPlaying);
      }
    } else {
      pauseSong();
    }
  };
  
  const skipTrack = (forward = true) => {
    const currentIndex = playlist.songs.findIndex(song => song === currentlyPlaying); // Changed songs to playlist.songs
    let newIndex = currentIndex + (forward ? 1 : -1);
    if (newIndex < 0) {
      newIndex = playlist.songs.length - 1; // Changed songs to playlist.songs
    } else if (newIndex >= playlist.songs.length) {
      newIndex = 0;
    }
    playSong(playlist.songs[newIndex]); // Changed songs to playlist.songs
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

  const handleGoBack = () => {
    window.history.back(); // Go back to the previous page
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div style={{ flex: 1, padding: '20px', color: 'white' }}>
        <Container>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" style={{ marginBottom: '20px' }} onClick={handleGoBack}>
              Back to Home
            </Button>
          </Link>
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            playlist && (
              <div style={{ position: 'relative' }}>
                <div className='template-background' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <Image src={playlist.playlistCover} alt="Liked" style={{ width: '250px', height: '250px', objectFit: 'contain', marginLeft: '10px' }} />
                  <div style={{ marginLeft: '10px' }}>
                    {/* <p style={{ color: 'white', fontFamily: selectedFont }}>Playlist</p> */}
                    <h2 className="mt-3 mb-3" style={{ color: 'white', fontSize: '50px', fontFamily: selectedFont }}>{playlist.name}</h2>
                    <p style={{ color: 'white', fontSize: '20px', fontFamily: selectedFont }}>Created by: {user?.data?.user_data?.name}</p>
                    <p style={{ color: 'white', fontSize: '20px', fontFamily: selectedFont }}>Number of Songs: {playlist.songs.length}</p>
                  </div>
                </div>
                <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '24px', fontFamily: selectedFont }}>Songs Included:</h3>
                {playlist.songs.map((song) => (
                  <div key={song.id} style={{ marginBottom: '20px' }}>
                    <Song key={song.id} song={song} playSong={() => playSong(song)} />
                  </div>
                ))}
              </div>
            )
          )}
        </Container>
        {/* MusicPlayer component with props */}
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
};

export default PlaylistDetails;
