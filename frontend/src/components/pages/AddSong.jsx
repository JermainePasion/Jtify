
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadSong } from '../../actions/songActions';
import { fetchMyPlaylists } from '../../actions/songActions';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';
import '../../designs/AddSong.css';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';

const AddSong = () => {
  const dispatch = useDispatch();
  const playlists = useSelector(state => state.myPlaylist.playlists);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#000';
  const selectedFont = user?.data?.profile_data?.font || 'Arial, sans-serif';
  const [isHovered, setIsHovered] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
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

  const handleRemovePicture = () => {
    setFormData({ ...formData, picture: '' });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0])
    const file = e.target.files[0];
    const fileName = `${formData.artist} - ${formData.name}`; // Construct the new file name using formData
    const renamedFile = new File([file], fileName, { type: file.type }); // Create a new File object with the new name
    setFormData({ ...formData, file: renamedFile });
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

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
     <div style={{ display: 'flex', minHeight: '120vh', backgroundColor: color, fontFamily: selectedFont, minHeight: '100vh' }}>
     {showNavbar && <Navbar />}
     
     <div className='template-background' style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center',minHeight: '120vh' }}>
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
      <div className='card-addsong'>
        <div style={{backgroundColor: color, border: 'none', borderRadius: '2.5rem', padding: '1rem 3rem', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: '-250px' }}>
        <div>
        <div style = {{color: 'white'}} >
          <h1>Add Song</h1>
          </div>
          <label htmlFor="picture" style={{ color: '#fff', padding: '8px', cursor: 'pointer' }}>
            <div style={{position: 'relative', width: '500px', height: '500px', overflow: 'hidden', borderRadius: '10%', backgroundColor: picture ? 'transparent' : '#fff',}}
              onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {picture && (
                <>
                  <img src={URL.createObjectURL(picture)} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {isHovered && (
                    <button onClick={handleRemovePicture} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', 
                    border: 'none', color: '#fff', cursor: 'pointer', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', 
                    transition: 'background 0.3s' }}>Remove Photo</button>)}
                </>
              )}
              {!picture && (
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ color: '#000', fontSize: '24px' }}>+</span>
                </div>
              )}
            </div>
          </label>
          <input type="file" id="picture" name="picture" onChange={handlePictureChange} style={{ display: 'none'}} />
          </div>
          <div style={{flexDirection: 'row', marginLeft: '1rem'}}>
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
            <div style={{ position: 'relative', marginBottom: '15px'}}>
              <label htmlFor="file" style={{ color: '#fff', marginRight: '10px', backgroundColor: '#333', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '15px' }}>
                {file ? 'Change Audio File' : 'Choose Audio File'}
              </label>
              <span style={{ color: '#fff', marginLeft: '10px' }}></span>
              {file && (
                <span style={{ color: '#fff', marginLeft: '10px' }}>
                  {`${formData.artist} - ${formData.name}`}
                </span>
              )}
              <input type="file" id="file" name="file" onChange={handleFileChange} accept="audio/*"style={{ display: 'none'}}/>
            </div>
            <div style={{ marginBottom: '15px'}}>
              <label htmlFor="playlistId" style={{ color: '#fff', marginRight: '10px' }}>Select Playlist:</label>
              <select id="playlistId" name="playlistId" value={playlistId} onChange={handleChange} style={{ padding: '8px' }}>
                <option value="">Select Playlist</option>
                {Array.isArray(playlists) && playlists.map(playlist => (
                  <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer',
            borderRadius: '5px',transition: 'background-color 0.3s',float: 'right'}}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#45a049'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}>Upload Song</button>
          </form>
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', top: '95.2%', left: '48%', transform: 'translate(-100%, -105%)', zIndex: '9999', display: 'flex' }}>
          <button
           
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "max(2vw, 18px)",
              color: "#9d9fa3",
            }}
          >
            <FaStepBackward />
          </button>
        </div>
        <div style={{ position: 'fixed', top: '92.5%', left: '53.5%', transform: 'translate(-50%, -50%)', zIndex: '9999' }}>
          <button
            
            style={{
              marginBottom: "20px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "max(2vw, 18px)",
              color: "#9d9fa3",
            }}
          >
            <FaStepForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSong;
