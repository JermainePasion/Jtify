import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddSong, listSongs } from '../../actions/songActions';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';

const AddForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  const [successPromptVisible, setSuccessPromptVisible] = useState(false); // State to manage the visibility of the success prompt

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

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
    ['Highlife', 'Highlife'],
    ['EDM', 'EDM'],
  ];

  const [pictureName, setPictureName] = useState('');
  const [audioName, setAudioName] = useState('');

  const handleSongUpload = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const artist = e.target.artist.value;
    const genre = e.target.genre.value;
    const picture = e.target.picture.files[0];
    const file = e.target.file.files[0];

    if (name && artist && genre && picture && file) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('artist', artist);
      formData.append('genre', genre);
      formData.append('picture', picture);
      formData.append('file', file);

      try {
        await dispatch(AddSong(formData));
        // Fetch songs again after adding a new one
        await dispatch(listSongs());
        setSuccessPromptVisible(true); // Show the success prompt
        // Hide the success prompt after a delay
        setTimeout(() => {
          setSuccessPromptVisible(false);
        }, 3000); // Adjust the delay as needed
      } catch (error) {
        console.error('Error in handleSongUpload:', error);
        // Handle the error (e.g., display a message to the user)
      }
    } else {
      // Handle error (e.g., display a message to the user)
    }
  };

  const handlePictureChange = (e) => {
    setPictureName(e.target.files[0].name);
  };

  const handleAudioChange = (e) => {
    setAudioName(e.target.files[0].name);
  };

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
          <h1 style={{ color: 'white', fontSize: '30px', marginBottom: '20px', position: 'relative', textAlign: 'center' }}>
            Add Song
          </h1>
          {successPromptVisible && ( // Conditionally render the success prompt
            <div style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
              Song uploaded successfully!
            </div>
          )}
          <form onSubmit={handleSongUpload} style={{ margin: '10px 0', textAlign: 'center' }}>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <label htmlFor="name" style={{ color: 'white', width: '100px', marginRight: '10px' }}>Song Name:</label>
              <input type="text" id="name" name='name' placeholder='Song Name' style={{ width: '50%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <label htmlFor="artist" style={{ color: 'white', width: '100px', marginRight: '10px' }}>Artist:</label>
              <input type='text' id="artist" name='artist' placeholder='Artist' style={{ width: '50%', padding: '8px' }} />
            </div>

            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <label htmlFor="genre" style={{ color: 'white', width: '100px', marginRight: '10px' }}>Genre:</label>
              <select id="genre" name='genre' defaultValue='' required style={{ width: '50%', padding: '8px' }}>
                <option value='' disabled>
                  Select Genre
                </option>
                {genres.map(([value, label], index) => (
                  <option key={index} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <label htmlFor="picture" style={{ color: 'white', width: '100px', marginRight: '10px' }}>Picture:</label>
              <input type='file' id="picture" name='picture' accept='image/*' style={{ color: 'white', margin: '0 10px' }} onChange={handlePictureChange} />
              {pictureName }
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <label htmlFor="file" style={{ color: 'white', width: '100px', marginRight: '10px' }}>Audio File:</label>
              <input type='file' id="file" name='file' accept='audio/*' style={{ color: 'white', margin: '0 10px' }} onChange={handleAudioChange} />
              {audioName }
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                type='submit'
                style={{ backgroundColor: color, color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
              >
                Add Song
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddForm;
