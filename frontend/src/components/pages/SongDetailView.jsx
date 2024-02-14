// SongDetail.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DetailViewSong, EditSong } from '../../actions/songActions';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';

const SongDetail = () => {
  const dispatch = useDispatch();
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

  const handleEditClick = () => {
    setIsEditing(true);

    // Copy current song details to editedSong state
    setEditedSong({
      name: song.name,
      artist: song.artist,
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
                        <Form.Label>Edit Name:</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter new name" 
                          value={editedSong.name || ''}
                          onChange={(e) => setEditedSong({ ...editedSong, name: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group controlId="formSongArtist">
                        <Form.Label>Edit Artist:</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter new artist" 
                          value={editedSong.artist || ''}
                          onChange={(e) => setEditedSong({ ...editedSong, artist: e.target.value })}
                        />
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
                    </Form>
                  )}
                  {!isEditing && (
                    <Button variant="primary" onClick={handleEditClick}>
                      Edit
                    </Button>
                  )}
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
