import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Spinner, Image, Col, Row } from 'react-bootstrap'; // Import Image from react-bootstrap
import { playlistDetailView } from '../../actions/songActions';
import { getUserDetails } from '../../actions/userActions';
import Navbar from '../Navbar';
import Song from '../Song';
import MusicPlayer from '../MusicPlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { setCurrentlyPlayingSong, togglePlayerVisibility } from '../../actions/musicPlayerActions';
import { updatePlayCount } from "../../actions/songActions";
import { faHeart } from '@fortawesome/free-solid-svg-icons';

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

  const playSong = async (song) => {
    setCurrentlyPlaying(song);
    dispatch(setCurrentlyPlayingSong(song));
    dispatch(togglePlayerVisibility());

    try {
      // Dispatch the updatePlayCount action to update the play count
      await dispatch(updatePlayCount(song.id, user.data.user_data.id));
    } catch (error) {
      // Handle any errors
      console.error('Error updating play count:', error);
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
    <div style={{ display: 'flex', minHeight: '110vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div style={{ flex: 1, padding: '20px', color: 'white' }}>
        <Container>
              {/* <Link to="/home" style={{ textDecoration: 'none' }}>
               <div className="back-to-home" onClick={handleGoBack}>
              <span className="arrow-icon" style={{ marginRight: '5px', fontSize: '25px' }}>&#8592;</span>
              <span className="button-text">Back to Home</span>
            </div>
             </Link> */}

          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            playlist && (
              <div style={{ position: 'relative' }}>
                <div className='template-background' style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderRadius: '15px' }}>
                  <Image src={playlist.playlistCover} alt="Liked" style={{ width: '250px', height: '250px', objectFit: 'contain', marginLeft: '10px', marginTop:'-10px',  marginBottom:'-10px' }} />
                  <div style={{ marginLeft: '5px' }}>
                    {/* <p style={{ color: 'white', fontFamily: selectedFont }}>Playlist</p> */}
                    <h2 className="mt-3 mb-3" style={{ color: 'white', fontSize: '100px', marginBottom: '10px', marginTop:'5px' ,fontFamily: selectedFont }}>{playlist.name}</h2>
                    <p style={{ color: 'white', fontSize: '20px', fontFamily: selectedFont, marginBottom: '5px', marginTop:'5px' }}>Created by: {user?.data?.user_data?.name}</p>
                    <p style={{ color: 'white', fontSize: '20px', fontFamily: selectedFont, marginBottom: '5px', marginTop:'5px' }}>Number of Songs: {playlist.songs.length}</p>
                  </div>
                </div>
                <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '20px', fontFamily: selectedFont }}>Titles:</h3>
                  {/* <span className="clock-icon" style={{ marginTop: '20px', marginRight: '20px', fontSize: '20px' }}>
                    <FontAwesomeIcon icon={faClock} />
                  </span> */}
                  </div>
                  <hr style={{ borderBottom: '1px solid white', marginBottom: '10px' }} />

                </div>
                {playlist.songs.map((song, index) => (
                <div key={song.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer' }} onClick={() => playSong(song)}>
                  <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{index + 1}</span>
                  <Image src={song.picture} alt={song.name} rounded style={{ marginRight: '15px', width: '64px', height: '63px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{song.name}</div>
                    <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '10px', fontWeight: 'normal' }}>{song.name}</span>
                      {/* Heart icon */}
                      <FontAwesomeIcon icon={faHeart} style={{ color: '#FFFFFF', marginLeft: '1120px', fontSize: '20px', marginTop: '-20px' }} />
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )
          )}
        </Container>
     
      </div>
    </div>
  );
};

export default PlaylistDetails;
