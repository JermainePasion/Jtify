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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: font }}>
    <Navbar style={{ flex: '0 0 auto', width: '200px', backgroundColor: 'black', color: 'white' }} />
    <div className='template-background' style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
    <h1 style={{color: 'white' }}>Be an Artist</h1>
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId='FormName'>
  <Form.Label style={{color: 'white' }}>Name</Form.Label>
  <Form.Control
    type='text'
    placeholder='Enter your name'
    name='name'  // Should match the key in formData
    value={formData.name}
    onChange={handleInputChange}
    required
  />
          </Form.Group>
          <Form.Group controlId='artistName'>
            <Form.Label style={{color: 'white' }}>Artist Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your artist name'
              name='artist_name'  // Should match the key in formData
              value={formData.artist_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label style={{color: 'white' }}>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter your email'
              name='email'  // Should match the key in formData
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId='phoneNumber'>
            <Form.Label style={{color: 'white' }}>Phone Number</Form.Label>
            <Form.Control
              type='tel'
              placeholder='Enter your phone number'
              name='phone_number'  // Should match the key in formData
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId='youtubeLink'>
            <Form.Label style={{color: 'white' }}>YouTube Link</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter your YouTube link'
              name='youtube_link'  // Should match the key in formData
              value={formData.youtube_link}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant='primary' type='submit' className='custom-button'>
          Submit
        </Button>
    </div>
        </Form>
      </div>
    </div>
       
  );
};

export default ArtistRegister;
