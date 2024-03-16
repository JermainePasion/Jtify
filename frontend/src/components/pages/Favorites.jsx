import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, ListGroup, Image } from 'react-bootstrap';
import Navbar from '../Navbar';
import { fetchLikedSongs, unlikeSong } from '../../actions/songActions';
import { getUserDetails } from '../../actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import MusicPlayer from '../MusicPlayer';
import Song from '../Song';

import likedImage from '../img/liked.png';

const Favorites = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const likedSongs = useSelector((state) => state.fetchLikedSongs.songs);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const navigate = useNavigate();
  const { loading, error, songs } = useSelector(state => state.songList);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);

  const handleSongClick = (index) => {
    if (currentSongIndex === index) {
      setCurrentSongIndex(null);
    } else {
      setCurrentSongIndex(index);
      playSong(index); // Play the clicked song
    }
  };

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.data && user.data.user_data && user.data.user_data.id) {
      dispatch(fetchLikedSongs(user.data.user_data.id));
    }
  }, [dispatch, user?.data?.user_data?.id]);

  const handleUnlike = (id) => {
    dispatch(unlikeSong(id)).then(() => {
      const updatedLikedSongs = likedSongs.filter(song => song.id !== id);
      dispatch({ type: 'UPDATE_LIKED_SONGS', payload: updatedLikedSongs });
    });
  };

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

  const playSong = (index) => {
    const song = likedSongs[index];
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
        playSong(0); // Play the first song in the liked songs list
      } else {
        playSong(currentSongIndex);
      }
    } else {
      pauseSong();
    }
  };

  const skipTrack = (forward = true) => {
    let newIndex = currentSongIndex + (forward ? 1 : -1);
    if (newIndex < 0) {
      newIndex = likedSongs.length - 1;
    } else if (newIndex >= likedSongs.length) {
      newIndex = 0;
    }
    setCurrentSongIndex(newIndex);
    playSong(newIndex);
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
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', minHeight: '115vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' style={{ flex: 1 }}>
        <Container fluid>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Image src={likedImage} alt="Liked" style={{ width: '250px', height: '250px', objectFit: 'contain', marginLeft: '10px' }} />
            <div style={{ marginLeft: '10px' }}>
              <p style={{ color: 'white', position: 'absolute', fontFamily: selectedFont }}>Playlist</p>
              <h2 className="mt-3 mb-3" style={{ color: 'white', fontSize: '50px', fontFamily: selectedFont }}>Liked Songs</h2>
              <p style={{ color: 'white', position: 'absolute', top: '162px', fontFamily: selectedFont }}>Songs that you like in Jtify app will be shown here.</p>
              <p style={{ color: 'white', position: 'absolute', fontSize: '20px', top: '200px', fontFamily: selectedFont }}>{likedSongs.length} songs</p>
            </div>
          </div>
          <ListGroup variant="flush">
            {likedSongs.map((likedSong, index) => (
              <ListGroup.Item key={index} className="position-relative" style={{ backgroundColor: 'transparent', color: '#ffffff', fontFamily: selectedFont, border: 'none', position: 'relative', marginBottom: '10px', marginLeft: '10px' }}>
                <div onClick={() => handleSongClick(index)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Image src={likedSong.picture} alt={likedSong.name} rounded style={{ marginRight: '15px', width: '64px', height: '64px' }} />
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>{likedSong.name}</div>
                    <div style={{ fontSize: '14px', position: 'absolute', center: '10px', left: '550px' }}><span style={{ fontWeight: 'normal' }}>{likedSong.artist}</span></div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '10px', right: '50px' }}>
                  <FontAwesomeIcon icon={faHeart} style={{ cursor: 'pointer', color: '#fff', fontSize: '20px' }} onClick={() => handleUnlike(likedSong.id)} />
                </div>
                {index !== likedSongs.length - 1 && <div style={{ position: 'absolute', bottom: '-1px', left: '0', width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}></div>}
                
              </ListGroup.Item>
              
            ))}
          </ListGroup>
        </Container>
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

export default Favorites;