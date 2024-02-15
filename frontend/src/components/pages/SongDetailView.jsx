// SongDetail.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DetailViewSong, DeleteSong, EditSong } from '../../actions/songActions'; // Import DeleteSong action
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useHistory hook
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';


const SongDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useHistory hook
  const { id } = useParams();
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(DetailViewSong(id));
  }, [dispatch, id]);

  const songDetail = useSelector((state) => state.songDetail);
  const { loading, song, error } = songDetail || {};
  const [editedSong, setEditedSong] = useState({});
  const [pictureFile, setPictureFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileNames, setFileNames] = useState({});

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
  ];

  const handleEditClick = () => {
    setIsEditing(true);

    // Copy current song details to editedSong state
    setEditedSong({
      name: song.name,
      artist: song.artist,
      genre: song.genre,
    });
  };

  const handleEdit = () => {
    const editedSongData = { ...editedSong };

    if (pictureFile) {
      editedSongData.picture = pictureFile;
    }

    if (audioFile) {
      editedSongData.file = audioFile;
    }

    dispatch(EditSong(id, editedSongData));

    // Reset editing mode after saving changes
    setIsEditing(false);
  };

  const handleFileChange = (fieldName, e) => {
    // Update file name for display
    const fileName = e.target.files[0]?.name || '';
    setFileNames((prevFileNames) => ({
      ...prevFileNames,
      [fieldName]: fileName,
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      dispatch(DeleteSong(id))
        .then(() => {
          // Redirect to home page after successful deletion
          navigate('/home');
        })
        .catch((error) => {
          // Handle error if deletion fails
          console.error('Error deleting song:', error);
        });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: selectedFont, backgroundColor: color }}>
      <div style={{ flex: '0 0 250px', backgroundColor: color, padding: '20px' }}>
        <Navbar />
      </div>
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        overflowX: 'auto', 
        padding: '10px 0',
        backgroundSize: 'cover',
      }}>
        <Container>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" style={{ marginBottom: '20px' }}>
              Back to Home
            </Button>
          </Link>
      
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : song ? (
            <Row>
              <Col>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={song.picture} alt="Album Cover" style={{ width: '300px', height: '300px', borderRadius: '15px', marginBottom: '20px' }} />
                  <h2 style={{ marginBottom: '10px', color: '#fff' }}>{song.name}</h2>
                  <p style={{ marginBottom: '20px', color: '#fff' }}>{song.artist}</p>
                  {isEditing && (
                    <Form>
                      <Form.Group controlId="formSongName">
                        <Form.Label style = {{color: 'white', margin: '10px'}}>Edit Name:</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter new name" 
                          value={editedSong.name || ''}
                          onChange={(e) => setEditedSong({ ...editedSong, name: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group controlId="formSongArtist">
                        <Form.Label style = {{color: 'white', margin: '10px'}}>Edit Artist:</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter new artist" 
                          value={editedSong.artist || ''}
                          onChange={(e) => setEditedSong({ ...editedSong, artist: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group controlId="formSongGenre">
                      <Form.Label style = {{color: 'white', margin: '10px'}}>Edit Genre:</Form.Label>
                      <select
                        id="genre"
                        name='genre'
                        value={editedSong.genre || ''} // Set the value of the select to editedSong.genre
                        onChange={(e) => setEditedSong({ ...editedSong, genre: e.target.value })} // Update genre in state
                        required
                        style={{ width: '75%', padding: '8px' }} // Adjust width and padding
                      >
                        <option value='' disabled>Select Genre</option>
                        {genres && genres.map(([value, label], index) => (
                          <option key={index} value={value}>{label}</option>
                        ))}
                      </select>
                    </Form.Group>
                      <Form.Group controlId="formPicture">
                        <Form.Label style={{ color: '#fff' }}>Edit Album Cover:</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange('picture', e);
                            setPictureFile(e.target.files[0]);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                        <p style={{ color: '#fff' }}>Chosen File: {fileNames.picture}</p>
                      </Form.Group>
                      <Form.Group controlId="formAudioFile">
                        <Form.Label style={{ color: '#fff' }}>Edit Audio File:</Form.Label>
                        <Form.Control
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            handleFileChange('audio', e);
                            setAudioFile(e.target.files[0]);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                        <p style={{ color: '#fff' }}>Chosen File: {fileNames.audio}</p>
                      </Form.Group>
                      <Button variant="primary" onClick={handleEdit}>
                        Save Changes
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>Cancel</Button>
                    </Form>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {!isEditing && (
                      <Button variant="primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>
                        Edit
                      </Button>
                    )}
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <p style={{ color: '#fff' }}>Song details not available</p>
          )}
        </Container>
      </div>
    </div>
  );
};

export default SongDetail;