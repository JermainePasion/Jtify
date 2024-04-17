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
import { FaStepForward, FaStepBackward } from "react-icons/fa";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { likeSong, unlikeSong } from '../../actions/songActions';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { fetchLikedSongs} from '../../actions/songActions';



const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, playlist, error } = useSelector((state) => state.playlistDetail);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const likedSongs = useSelector(state => state.fetchLikedSongs.songs);
  const isLiked = likedSongs ? likedSongs.some(likedSong => likedSong.id === id) : false;
  const [liked, setLiked] = useState(isLiked);

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
    if (user && user.data && user.data.user_data && user.data.user_data.id) {
      dispatch(fetchLikedSongs(user.data.user_data.id));
    }
  }, [dispatch, user?.data?.user_data?.id]);

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

  
  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      const newIndex = currentSongIndex - 1;
      setCurrentSongIndex(newIndex);
      playSong(playlist.songs[newIndex]);
    }
  };
  
  const playNextSong = () => {
    if (currentSongIndex < playlist.songs.length - 1) {
      const newIndex = currentSongIndex + 1;
      setCurrentSongIndex(newIndex);
      playSong(playlist.songs[newIndex]);
    }
  };


  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleLike = (songId) => {
    if (liked) {
        dispatch(unlikeSong(songId));
    } else {
        dispatch(likeSong(songId));
    }
    setLiked(!liked);
};




  return (
    
    <div
      style={{
        display: "flex",
        width: "100vw",
        minHeight: "120vh",
        backgroundColor: color,
        fontFamily: selectedFont,
        overflowx: "auto",
      }}
    >
      
      
          {showNavbar && <Navbar />}
          <div style={{ position: 'relative', zIndex: '9999' }}>
          <div style={{ position: 'absolute', top: '10px', left: '5px', zIndex: '9999' }}>
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
          {/* Your other component content here */}
        </div>
          
      <div className='template-background-wrapper' style={{ overflowY: 'auto', flex: 1 }}>
      
        
        <Container>
              

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
                {/* Pass song.id to handleLike function */}
                <FontAwesomeIcon 
    icon={liked ? solidHeart : regularHeart} 
    onClick={() => handleLike(song.id)}  
    style={{ cursor: 'pointer', color: liked ? '#fff' : '#fff', marginLeft: '1000px', position: 'absolute' }} 
/>
            </div>
        </div>
    </div>
              ))}
              </div>
            )
          )}
          
          <div style={{ position: 'fixed', top: '91.8%', left: '46.4%', transform: 'translate(-50%, -50%)', zIndex: '9999' }}>
              <button
                onClick={playPreviousSong}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "max(2vw, 18px)",
                  color: "#fff",
                }}
              >
                <FaStepBackward />
              </button>
            </div>
            <div style={{ position: 'fixed', top: '93%', left: '53.5%', transform: 'translate(-50%, -50%)', zIndex: '9999' }}>
              <button
                onClick={playNextSong}
                style={{
                  marginBottom: "20px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "max(2vw, 18px)",
                  color: "#fff",
                }}
              >
                <FaStepForward />
              </button>
              
            </div>
        </Container>
     
      </div>
      
      
    </div>
  );
};

export default PlaylistDetails;
