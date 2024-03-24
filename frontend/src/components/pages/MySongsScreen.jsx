import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySongs } from '../../actions/songActions';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navbar from '../Navbar';

const MySongsScreen = () => {
  const dispatch = useDispatch();
  const { loading, songs, error } = useSelector((state) => state.mySongs);
  const user = useSelector((state) => state.userDetails.user);
  const selectedFont = user?.data?.profile_data?.font || 'Arial, sans-serif';
  const color = user?.data?.profile_data?.color || '#defaultColor';

  useEffect(() => {
    dispatch(fetchMySongs());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', backgroundColor: color, minHeight: '115vh', color: '#fff', fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        padding: '10px 20px', // Increase padding for better spacing
        backgroundSize: '110%',
        backgroundRepeat: 'no-repeat'

      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>My Songs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {songs.map((song) => (
              <li key={song.id} style={{ marginBottom: '10px', borderBottom: '1px solid #444', display: 'flex', alignItems: 'center' }}>
                <Link to={`/songs/${song.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                  <img src={song.picture} alt={song.name} style={{ width: '64px', height: '64px', marginRight: '10px' }} />
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{song.name}</span>
                    <span style={{ marginLeft: '10px' }}>- {song.artist}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MySongsScreen;
