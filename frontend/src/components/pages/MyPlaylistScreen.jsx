import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPlaylists } from '../../actions/songActions';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';

const PlaylistScreen = () => {
  const dispatch = useDispatch();
  const { loading, playlists, error } = useSelector((state) => state.myPlaylist);
  const userDetails = useSelector((state) => state.userDetails);
  const color = userDetails?.user?.data?.profile_data?.color || '#CCC'; // Adjusted color to off light gray
  const selectedFont = userDetails?.user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(fetchMyPlaylists());
  }, [dispatch]);

  return (
    <div style={{ fontFamily: selectedFont, display: 'flex', backgroundColor: color, minHeight: '100vh', color: '#000' }}> {/* Changed text color to black */}
      <div style={{ flex: '0 0 auto' }}>
        <Navbar />
      </div>
      <div style={{ padding: '20px', flex: '1 1 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '32px', marginBottom: '20px' }}>My Playlists</h2> {/* Changed text color to black */}
          <Link to="/add-playlist" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: 'white', color: color, border: 'none', padding: '8px 12px', cursor: 'pointer' }}>Add Playlist</button> {/* Adjusted button background color to black */}
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {playlists.map((playlist) => (
              <div key={playlist.id} style={{ marginRight: '10px', marginBottom: '10px', width: '150px' }}> {/* Adjusted width */}
                <Link to={`/playlist/${playlist.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}> {/* Adjusted background color to off light gray */}
                    <img src={playlist.playlistCover} alt={playlist.name} style={{ width: '100%', height: '115px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }} />
                    <div style={{ padding: '10px' }}>
                      <h3 style={{ color: '#000', fontSize: '14px', marginBottom: '5px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playlist.name}</h3> {/* Changed text color to black */}
                      <p style={{ color: '#666', fontSize: '12px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playlist.description}</p> {/* Adjusted text color to dark gray */}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistScreen;
