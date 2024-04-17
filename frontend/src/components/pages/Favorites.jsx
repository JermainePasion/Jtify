import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, ListGroup, Image } from 'react-bootstrap';
import Navbar from '../Navbar';
import { fetchLikedSongs, unlikeSong } from '../../actions/songActions';
import { getUserDetails } from '../../actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import MusicPlayer from '../MusicPlayer';
import Song from '../Song';
import { setCurrentlyPlayingSong, togglePlayerVisibility } from '../../actions/musicPlayerActions';
import { updatePlayCount } from "../../actions/songActions";
import { FaStepForward, FaStepBackward } from "react-icons/fa";
import likedImage from '../img/liked.png';

const Favorites = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const likedSongs = useSelector((state) => state.fetchLikedSongs.songs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const navigate = useNavigate();
  const { loading, error, songs } = useSelector(state => state.songList);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(true);
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

  useEffect(() => {
    localStorage.setItem("currentSongIndex", currentSongIndex);
  }, [currentSongIndex]);

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  const playSong = async (index) => {
    const song = likedSongs[index];

    try {
      // Dispatch the updatePlayCount action to update the play count
      await dispatch(updatePlayCount(song.id, user.data.user_data.id));
    } catch (error) {
      // Handle any errors
      console.error('Error updating play count:', error);
    }
  
    setCurrentlyPlaying(song);
    dispatch(setCurrentlyPlayingSong(song));
    dispatch(togglePlayerVisibility());
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    // Do not set currentTime when pausing
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




  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  
  const playNextSong = () => {
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= likedSongs.length) {
      nextIndex = 0;
    }
    setCurrentSongIndex(nextIndex);
    localStorage.setItem("currentSongIndex", nextIndex); // Store the next index in local storage
    playSong(nextIndex);
  };
  
  const playPreviousSong = () => {
    let previousIndex = currentSongIndex - 1;
    if (previousIndex < 0) {
      previousIndex = likedSongs.length - 1;
    }
    setCurrentSongIndex(previousIndex);
    localStorage.setItem("currentSongIndex", previousIndex); // Store the previous index in local storage
    playSong(previousIndex);
  };

  return (
    <div style={{ display: 'flex', minHeight: '150vh', backgroundColor: color, fontFamily: selectedFont }}>
      {showNavbar && <Navbar />}
      <div className='template-background' style={{ 
        flex: 1, 
        position: 'relative', 
        padding: '10px', // Adjust padding for better spacing
        backgroundSize: 'cover', // Use 'cover' to fill the container
        backgroundPosition: 'center', // Center the background image
        overflow: 'auto' // Add overflow for content that exceeds the container
      }}>
        <Container fluid>
          <div className="playlist-header-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
            <img src={likedImage} alt="Liked" className="playlist-image" />
            <div className="text-container" style={{ marginLeft: '10px' }}>
              <p style={{ color: 'white', fontFamily: selectedFont }}>Playlist</p>
              <h2 className="mt-3 mb-3" style={{ color: 'white', fontSize: '50px', fontFamily: selectedFont }}>Liked Songs</h2>
              <p style={{ color: 'white', fontFamily: selectedFont }}>Songs that you like in Jtify app will be shown here.</p>
              <p style={{ color: 'white', fontSize: '20px', fontFamily: selectedFont }}>{likedSongs.length} songs</p>
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
          <div>
            
          </div>
          <div style={{ position: 'absolute', top: '10px', left: '5px' }}>
            <FontAwesomeIcon
              icon={faBars}
              style={{
                cursor: 'pointer',
                color: '#fff',
                fontSize: '20px',
                transform: showNavbar ? 'rotate(0deg)' : 'rotate(90deg)',
                transition: 'transform 0.3s ease',
              }}
              onClick={toggleNavbar}
            />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Favorites;
