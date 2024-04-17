import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySongs } from '../../actions/songActions';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navbar from '../Navbar';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySongsScreen = () => {
  const dispatch = useDispatch();
  const { loading, songs, error } = useSelector((state) => state.mySongs);
  const user = useSelector((state) => state.userDetails.user);
  const selectedFont = user?.data?.profile_data?.font || 'Arial, sans-serif';
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    dispatch(fetchMySongs());
  }, [dispatch]);

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont}}>
    {showNavbar && <Navbar />}
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        padding: '10px 20px', // Increase padding for better spacing
        backgroundSize: '130%',
        backgroundRepeat: 'no-repeat',
        minHeight: '120vh'

      }}>
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
