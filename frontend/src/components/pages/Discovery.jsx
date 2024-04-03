// Discovery.js
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsByGenre } from '../../actions/songActions';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';
import Song from '../Song';
import MusicPlayer from '../MusicPlayer';
import { setCurrentlyPlayingSong, togglePlayerVisibility } from '../../actions/musicPlayerActions';
import { updatePlayCount } from "../../actions/songActions";

const Discovery = () => {
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showGenres, setShowGenres] = useState(true); // State to manage the visibility of genre buttons
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const { genreSongs, loading } = useSelector((state) => state.songGenre);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [query, setQuery] = useState('');
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGenre) {
      dispatch(fetchSongsByGenre(selectedGenre));
    }
  }, [dispatch, selectedGenre]);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setShowGenres(false); 
  };

  const handleGoBack = () => {
    setSelectedGenre(''); 
    setShowGenres(true); 
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
        playSong(genreSongs[0]);
      } else {
        playSong(currentlyPlaying);
      }
    } else {
      pauseSong();
    }
  };

  const skipTrack = (forward = true) => {
    const currentIndex = genreSongs.findIndex(song => song === currentlyPlaying);
    let newIndex = currentIndex + (forward ? 1 : -1);
    if (newIndex < 0) {
      newIndex = genreSongs.length - 1;
    } else if (newIndex >= genreSongs.length) {
      newIndex = 0;
    }
    playSong(genreSongs[newIndex]);
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
  const genres = [
    ['Hip-Hop', 'Hip-Hop'],
    ['R&B', 'R&B'],
    ['Pop', 'Pop'],
    ['Rock', 'Rock'],
    ['Country', 'Country'],
    ['Jazz', 'Jazz'],
    ['Classical', 'Classical'],
    ['Blues', 'Blues'],
    ['Electronic', 'Electronic'],
    ['Reggae', 'Reggae'],
    ['Folk', 'Folk'],
    ['Punk', 'Punk'],
    ['Metal', 'Metal'],
    ['Soul', 'Soul'],
    ['Funk', 'Funk'],
    ['Disco', 'Disco'],
    ['Gospel', 'Gospel'],
    ['House', 'House'],
    ['Techno', 'Techno'],
    ['Dubstep', 'Dubstep'],
    ['Trap', 'Trap'],
    ['Drum & Bass', 'Drum & Bass'],
    ['Grime', 'Grime'],
    ['Garage', 'Garage'],
    ['Salsa', 'Salsa'],
    ['Afrobeat', 'Afrobeat'],
    ['Highlife', 'Highlife']
  ];

  function getStripeColor(index) {
    const colors = ['#FF5733', '#33FFA8', '#3366FF', '#FF33EB', '#FFD933', '#33FFFA', '#B33AFF', '#FF334D']; // Example colors
    return colors[index % colors.length]; 
  }

  return (
    <div style={{ display: 'flex', minHeight: '115vh', backgroundColor: color, fontFamily: selectedFont, minHeight: '100vh' }}>
      <Navbar style={{ flex: '0 0 auto', width: '200px', backgroundColor: 'black', color: 'white' }} />
      <div className='template-background' style={{ flex: 1, padding: '20px', color: 'white' }}>
        <h2 style={{ color: 'white', textAlign: 'left', fontFamily: selectedFont, fontSize: '40px' }}>Discovery Page</h2>

        {selectedGenre && (
          <button onClick={handleGoBack} className="custom-button">Go Back</button>
        )}
        
        {selectedGenre && (
          <p style={{ color: 'white', fontFamily: selectedFont, fontSize: '20px', marginBottom: '10px' }}>Selected Genre: {selectedGenre}</p>
        )}

        {showGenres && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px', maxWidth: '1500px' }}>
            {genres.map((genre, index) => (
              <button key={index} onClick={() => handleGenreSelect(genre[1])} style={{
                margin: '0', padding: '12px 16px', borderRadius: '5px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer',
                borderLeft: `5px solid ${getStripeColor(index)}` // Use a function to get the stripe color based on index
              }}>{genre[0]}</button>
            ))}
          </div>
        )}

        {selectedGenre && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              genreSongs.length === 0 ? (
                <p>No songs available for this genre.</p>
              ) : (
                genreSongs.map(song => (
                  <Song key={song.id} song={song} playSong={() => playSong(song)} />
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
