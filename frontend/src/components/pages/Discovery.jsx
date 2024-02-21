import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsByGenre } from '../../actions/songActions'; // Update the path as per your project structure
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions'; // Import getUserDetails action

const Discovery = () => {
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState(''); // State to store selected genre

  // Get user details and genre songs from Redux state
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const { genreSongs, loading } = useSelector(state => state.songGenre);

  useEffect(() => {
    dispatch(getUserDetails()); // Fetch user details when the component mounts
  }, [dispatch]);

  // Fetch songs based on the selected genre
  useEffect(() => {
    if (selectedGenre) {
      dispatch(fetchSongsByGenre(selectedGenre));
    }
  }, [dispatch, selectedGenre]);

  // Function to handle genre selection
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar style={{ flex: '0 0 auto', width: '200px', backgroundColor: 'black', color: 'white' }} />
      <div className='template-background' style={{ flex: 1, padding: '20px' }}>
        <h2 style={{ color: 'white', textAlign: 'center' }}>Discovery Page</h2>
        
        {/* Genre buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={() => handleGenreSelect('Jazz')} style={{ margin: '0 10px' }}>Jazz</button>
          <button onClick={() => handleGenreSelect('Metal')} style={{ margin: '0 10px' }}>Metal</button>
          <button onClick={() => handleGenreSelect('Hip-Hop')} style={{ margin: '0 10px' }}>Hip-Hop</button>
        </div>

        {/* Display songs based on the selected genre */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {genreSongs.length === 0 ? (
              <p>No songs available for this genre.</p>
            ) : (
              genreSongs.map(song => (
                <div key={song.id}>
                  <p>{song.name}</p>
                  <p>{song.artist}</p>
                  <p>{song.picture}</p>
                  {/* Add more song details */}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
