import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsByGenre } from '../../actions/songActions';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';
import Song from '../Song';

const Discovery = () => {
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState('');
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const { genreSongs, loading } = useSelector((state) => state.songGenre);

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar style={{ flex: '0 0 auto', width: '200px', backgroundColor: 'black', color: 'white' }} />
      <div className='template-background' style={{ flex: 1, padding: '20px', color: 'white' }}>
        <h2 style={{ color: 'white', textAlign: 'center', fontFamily: selectedFont }}>Discovery Page</h2>
        
        {/* Genre buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {genres.map((genre, index) => (
            <button key={index} onClick={() => handleGenreSelect(genre[1])} style={{ margin: '0', padding: '10px', borderRadius: '5px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>{genre[0]}</button>
          ))}
        </div>

        {/* Display songs based on the selected genre */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            genreSongs.length === 0 ? (
              <p>No songs available for this genre.</p>
            ) : (
              genreSongs.map(song => (
                <Song key={song.id} song={song} playSong={() => {}} />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
