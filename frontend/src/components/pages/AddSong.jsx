import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadSong } from '../../actions/songActions';
import { fetchMyPlaylists } from '../../actions/songActions';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';

const AddSong = () => {
  const dispatch = useDispatch();
  const playlists = useSelector(state => state.myPlaylist.playlists);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#000';
  const selectedFont = user?.data?.profile_data?.font || 'Arial, sans-serif';

  useEffect(() => {
    dispatch(fetchMyPlaylists());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    genre: '',
    file: '',
    picture:'',
    playlistId: ''
  });

  const { name, artist, genre, file, picture, playlistId } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    console.log(e.target.files[0])
    setFormData({ ...formData, picture: e.target.files[0] });
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0])
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(uploadSong(playlistId, formData));
    setFormData({
      name: '',
      artist: '',
      genre: '',
      // file: '',
      // picture:'',
      playlistId: ''
    });
  };

  const genres = [
    'Hip-Hop', 'R&B', 'Pop', 'Rock', 'Country', 'Jazz', 'Classical',
    'Blues', 'Electronic', 'Reggae', 'Folk', 'Punk', 'Metal', 'Soul',
    'Funk', 'Disco', 'Gospel', 'House', 'Techno', 'Dubstep', 'Trap',
    'Drum & Bass', 'Grime', 'Garage', 'Salsa', 'Afrobeat', 'Highlife',
    'EDM'
  ];

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' style={{ flex: 1, marginLeft: '10px', padding: '10px 0' }}>
        <div style = {{color: 'white'}} >
          <h1>Add Song</h1>
        </div>
        <div >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="name" style={{ color: '#fff', marginRight: '10px' }}>Name:</label>
              <input type="text" id="name" name="name" value={name} onChange={handleChange} style={{ padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="artist" style={{ color: '#fff', marginRight: '10px' }}>Artist:</label>
              <input type="text" id="artist" name="artist" value={artist} onChange={handleChange} style={{ padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="genre" style={{ color: '#fff', marginRight: '10px' }}>Genre:</label>
              <select id="genre" name="genre" value={genre} onChange={handleChange} style={{ padding: '8px' }}>
                <option value="">Select Genre</option>
                {genres.map((genreOption, index) => (
                  <option key={index} value={genreOption}>{genreOption}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="file" style={{ color: '#fff', marginRight: '10px' }}>File:</label>
              <input type="file" id="file" name="file" onChange={handleFileChange} style={{ color: '#fff', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="picture" style={{ color: '#fff', marginRight: '10px' }}>Picture:</label>
              <input type="file" id="picture" name="picture" onChange={handlePictureChange} style={{ color: '#fff', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="playlistId" style={{ color: '#fff', marginRight: '10px' }}>Select Playlist:</label>
              <select id="playlistId" name="playlistId" value={playlistId} onChange={handleChange} style={{ padding: '8px' }}>
                <option value="">Select Playlist</option>
                {Array.isArray(playlists) && playlists.map(playlist => (
                  <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer' }}>Upload Song</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSong;
