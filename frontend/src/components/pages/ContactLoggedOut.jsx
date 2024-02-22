import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { contactUs } from '../../actions/userActions';
import Footer from '../Footer';

const ContactLoggedOut = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState(null); // Add state for error handling
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(contactUs(formData.name, formData.email, formData.message));
      setShowSuccessMessage(true);
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error.message); // Set error message
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>


                  <Card style={{ width: '400px', padding: '20px', border: '2px solid white', borderRadius: '10px' }}>
                    <h1 style={{ textAlign: 'center', color: 'white' }}>Contact Us</h1>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    {showSuccessMessage && <p style={{ color: 'green', textAlign: 'center', color: 'white' }}>Form submitted successfully!</p>}
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
                    <div style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>
                      Don't have an account? <Link style={{ color: 'white', marginTop: '10px', textAlign: 'center' }} to="/register">Sign up here</Link>
                    </div>

                    <div style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>
                      Already have an Account? <Link style={{ color: 'white', marginTop: '10px', textAlign: 'center' }} to="/">Sign In here</Link>
                    </div>

                    <div style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>
                      <Link style={{ color: 'white', marginTop: '10px', textAlign: 'center' }} to="/requestPassword">Forgot Password</Link>
                    </div>
                  </Card>


      <div className="background">
        <div className="logo-image">
          <img src="Jlogo.png" alt="background" width={200} />
        </div>
      </div>
    </div>
  );
};

export default ContactLoggedOut;
