import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../actions/userActions';
import { artistRegister } from '../../actions/userActions';
import Navbar from '../Navbar';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ArtistRegister = ({ playNextSong, playPreviousSong }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    phone_number: '',
    youtube_link: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(artistRegister(formData.phone_number, formData.youtube_link));
    } catch (error) {
      console.error('Artist registration error:', error);
    }
  };

  const { user, loading, error } = useSelector(state => state.userDetails);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const font = user?.data?.profile_data?.font || 'defaultFont';
  const userName = user?.data?.user_data?.name || '';
  const userEmail = user?.data?.user_data?.email || '';
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: font, minHeight: '100vh' }}>
     {showNavbar && <Navbar />}
     
      <div className='template-background' style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Playback control buttons */}
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
        

        {/* Register form */}
        <div className="form-box" style={{ width: '60%' }}>
          <Form onSubmit={handleSubmit}>
            <h1 style={{ color: '#A020F0', fontSize: '2.5em' }}><span style={{ color: '#0000FF' }}>Register</span> Form</h1>
            <p style={{ color: 'black', marginTop: '-1.5em' }}>Please fill in this form to register as an artist.</p>
            <div>
              <p>Name: {userName}</p>
              <p>Email: {userEmail}</p>
            </div>
            <Form.Group controlId='phoneNumber'>
              <Form.Label style={{ color: 'black' }}>Phone Number</Form.Label>
              <Form.Control
                type='tel'
                placeholder='Enter your phone number'
                name='phone_number'
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='youtubeLink'>
              <Form.Label style={{ color: 'black' }}>YouTube Link</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your YouTube link'
                name='youtube_link'
                value={formData.youtube_link}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='primary'
                type='submit'
                className='custom-button'
                style={{ backgroundColor: '#28a745', borderColor: '#28a745', color: '#fff', width: '200px' }}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ArtistRegister;
