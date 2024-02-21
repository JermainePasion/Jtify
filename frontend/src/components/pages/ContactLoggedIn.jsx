import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { contactUs, getUserDetails } from '../../actions/userActions';
import Navbar from '../Navbar';

const ContactLoggedIn = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user details from Redux state
  const { user } = useSelector(state => state.userDetails);
  const isAuthenticated = user !== null; // Check if user is authenticated
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const font = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    try {
      await dispatch(contactUs(formData.name, formData.email, formData.message));
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Contact form submission error:', error);
    }
  };

  if (!isAuthenticated) {
    return null; // Return null if the user is not authenticated
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: font }}>
      <Navbar style={{ flex: '0 0 auto', width: '200px', backgroundColor: 'black', color: 'white' }} />
      <div className='template-background' style={{ flex: 1, padding: '20px' }}>
        <h2 style={{ color: 'white', textAlign: 'center' }}>Contact Us</h2>
        <Card style={{ padding: '20px', border: '2px solid white', borderRadius: '10px' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='formName'>
              <Form.Label style={{ color: 'white' }}>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId='formEmail'>
              <Form.Label style={{ color: 'white' }}>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId='formMessage'>
              <Form.Label style={{ color: 'white' }}>Message</Form.Label>
              <Form.Control
                as='textarea'
                rows={4}
                placeholder='Type your message here'
                name='message'
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant='primary' type='submit'>
              Send
            </Button>
          </Form>
        </Card>
        {showSuccessMessage && (
          <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
            Form submitted successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactLoggedIn;