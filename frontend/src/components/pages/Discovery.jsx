import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsByGenre } from '../../actions/songActions';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';
import Song from '../Song';

const Discovery = () => {
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showGenres, setShowGenres] = useState(true); // State to manage the visibility of genre buttons
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
    setShowGenres(false); 
  };

  const handleGoBack = () => {
    setSelectedGenre(''); 
    setShowGenres(true); 
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
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
                  <Song key={song.id} song={song} playSong={() => {}} />
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