import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySongs, addPlaylist } from '../../actions/songActions';
import Navbar from '../Navbar';
import { Nav } from 'react-bootstrap';

const AddPlaylistScreen = () => {
  const dispatch = useDispatch();
  const mySongsState = useSelector(state => state.mySongs);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(fetchMySongs());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

  
    try {
      await dispatch(addPlaylist(formData));
      // Optionally, you can redirect the user to another page after successful playlist addition
    } catch (error) {
      console.error('Error adding playlist:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  const { loading, error, songs } = mySongsState;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar style={{ alignSelf: 'flex-start' }} />
      <div
        className='template-background'
        style={{
          flex: 1,
          marginLeft: '10px',
          position: 'relative',
          overflowX: 'auto',
          padding: '10px 0',
          backgroundSize: 'cover',
        }}
      >
        <div>
          <h2 style={{ color: 'white', fontSize: '30px', marginBottom: '20px', position: 'relative', textAlign: 'center' }}>Add Playlist</h2>
          <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="name" style={{ color: 'white', marginRight: '10px' }}>Name:</label>
              <input type="text" id="name" name="name" required style={{ padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="playlistCover" style={{ color: 'white', marginRight: '10px' }}>Playlist Cover:</label>
              <input type="file" id="playlistCover" name="playlistCover" required style={{ color: 'white', padding: '8px' }} />
            </div>
            {/* <div style={{ marginBottom: '15px' }}>
              <label htmlFor="songs" style={{ color: 'white', marginRight: '10px' }}>Select Songs:</label>
              <select id="songs" name="songs" multiple style={{ color: 'black', padding: '8px' }}>
                {songs.map(song => (
                  <option key={song.id} value={song.id}>{song.name}</option>
                ))}
              </select> */}
            {/* </div> */}
            <div>
              <button type="submit" style={{ backgroundColor: color, color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>Add Playlist</button>
          </div>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}> <Nav.Link href="/add-songs" style={{ color: 'white' }}>Add song</Nav.Link> </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlaylistScreen;
