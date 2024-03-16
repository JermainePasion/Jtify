import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {getUserDetails } from '../../actions/userActions';
import { artistRegister } from '../../actions/userActions';
import Navbar from '../Navbar';


const ArtistRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    artist_name: '',
    email: '',
    phone_number: '',
    youtube_link: ''
  });
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    try {
      await dispatch(artistRegister(formData.name, formData.artist_name, formData.email, formData.phone_number, formData.youtube_link));
    } catch (error) {
      console.error('Contact form submission error:', error);
    }
  };


  // Get user details from Redux state
  const { user } = useSelector(state => state.userDetails);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const font = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', minHeight: '115vh', backgroundColor: color, fontFamily: font }}>
      <Navbar style={{ flex: '0 0 auto', width: '200px', backgroundColor: 'black', color: 'white' }} />
      <div className='template-background artist-register-container' style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Adjusted width of the form box */}
        <div className="form-box" style={{ width: '36%' }}>
          <Form onSubmit={handleSubmit}>
          <h1 style={{ WebkitBackgroundClip: 'text', color: '#A020F0', fontSize: '2.5em' }}><span style={{ color: '#0000FF' }}>Register</span> Form</h1>
            <p style={{ color: 'black', marginTop: '-1.5em'  }}>Please fill in this form to register as an artist.</p>

            <Form.Label style={{ color: 'black' }}>Name</Form.Label>
            <Form.Group controlId='FormName'>
              <Form.Control
                type='text'
                placeholder='Name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ borderRadius: '3px' }} 
              />
            </Form.Group>
            <Form.Label style={{ color: 'black' }}>Artist Name</Form.Label>
            <Form.Group controlId='artistName'>
              <Form.Control
                type='text'
                placeholder='Enter your artist name'
                name='artist_name'
                value={formData.artist_name}
                onChange={handleInputChange}
                required
                style={{ borderRadius: '3px' }} 
              />
            </Form.Group>
            <Form.Label style={{ color: 'black' }}>Email</Form.Label>
            <Form.Group controlId='email'>
              <Form.Control
                type='email'
                placeholder='Enter your email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{ borderRadius: '3px' }} 
              />
            </Form.Group>
            <Form.Label style={{ color: 'black' }}>Phone Number</Form.Label>
            <Form.Group controlId='phoneNumber'>
              <Form.Control
                type='tel'
                placeholder='Enter your phone number'
                name='phone_number'
                value={formData.phone_number}
                onChange={handleInputChange}
                required
                style={{ borderRadius: '3px' }} 
              />
            </Form.Group>
            <Form.Label style={{ color: 'black' }}>YouTube Link</Form.Label>
            <Form.Group controlId='youtubeLink'>
              <Form.Control
                type='text'
                placeholder='Enter your YouTube link'
                name='youtube_link'
                value={formData.youtube_link}
                onChange={handleInputChange}
                required
                style={{ borderRadius: '3px' }} 
              />
            </Form.Group>
            <Form.Group controlId='submitBtn' style={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant='primary' 
                type='submit' 
                className='custom-button'
                style={{ backgroundColor: '#28a745', borderColor: '#28a745', color: '#fff', width: '200px' }}>
                Submit
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ArtistRegister;
