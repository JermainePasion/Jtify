import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPlaylists } from '../../actions/songActions';
import Navbar from '../Navbar'; // Import the Navbar component
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const PlaylistScreen = () => {
  const dispatch = useDispatch();
  const { loading, playlists, error } = useSelector((state) => state.myPlaylist);
  const userDetails = useSelector((state) => state.userDetails);
  const color = userDetails?.user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = userDetails?.user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(fetchMyPlaylists()); // Dispatch the action to fetch playlists when the component mounts
  }, [dispatch]);

  return (
    <div style={{ fontFamily: selectedFont, display: 'flex', backgroundColor: color, minHeight: '100vh', color: '#fff' }}>
      <div style={{ flex: '0 0 auto' }}>
        <Navbar /> {/* Render the Navbar component */}
      </div>
      <div style={{ padding: '20px', flex: '1 1 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', fontSize: '32px', marginBottom: '20px' }}>My Playlists</h2>
          {/* Add the Link to the Add Playlist screen */}
          <Link to="/add-playlist" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#fff', color: color, border: 'none', padding: '8px 12px', cursor: 'pointer' }}>Add Playlist</button>
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {playlists.map((playlist) => (
              <Link to={`/playlist/${playlist.id}`} key={playlist.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                {/* Wrap each card with Link and specify the path to the playlist detail view */}
                <div style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                  <img src={playlist.playlistCover} alt={playlist.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#333', fontSize: '24px', marginBottom: '10px' }}>{playlist.name}</h3>
                    <p style={{ color: '#666', fontSize: '16px' }}>{playlist.description}</p>
                    {/* You can add more details about the playlist here */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistScreen;
