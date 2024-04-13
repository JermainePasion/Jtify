import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { contactUs, getUserDetails } from '../../actions/userActions';
import Navbar from '../Navbar';
import { FaEnvelope, FaMapMarker, FaPhone } from 'react-icons/fa';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [showNavbar, setShowNavbar] = useState(true);

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

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
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
    <div style={{ display: 'flex', minHeight: '120vh', backgroundColor: color, fontFamily: font }}>
    {showNavbar && <Navbar />}
    <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        padding: '10px 20px', // Increase padding for better spacing
        backgroundSize: '120%',
        backgroundRepeat: 'no-repeat'

      }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>

          {/* Information Box 1 */}
          <Card style={{ flex: 1, padding: '20px', border: '2px solid white', borderRadius: '10px', marginLeft: '10px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <h4 style={{ color: 'white', textAlign: 'center' }}> <FaEnvelope style={{ marginRight: '10px', fontSize: '40px', marginLeft: '10px', marginBottom: '0px' }} /></h4>
            <h1 style={{ color: 'white', textAlign: 'center' }}>Email</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
              <p>Information goes here...</p>
            </div>
          </Card>

          {/* Information Box 2 */}
          <Card style={{ flex: 1, padding: '20px', border: '2px solid white', borderRadius: '10px', marginLeft: '10px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <h4 style={{ color: 'white', textAlign: 'center' }}> <FaMapMarker style={{ marginRight: '10px', fontSize: '40px', marginLeft: '10px', marginBottom: '0px' }} /></h4>
            <h1 style={{ color: 'white', textAlign: 'center' }}>Address</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
              <p>Information goes here...</p>
            </div>
          </Card>

          {/* Information Box 3 */}
          <Card style={{ flex: 1, padding: '20px', border: '2px solid white', borderRadius: '10px', marginLeft: '10px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <h4 style={{ color: 'white', textAlign: 'center' }}> <FaPhone style={{ marginRight: '10px', fontSize: '40px', marginLeft: '10px', marginBottom: '0px' }} /></h4>
            <h1 style={{ color: 'white', textAlign: 'center' }}>Contact</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
              <p>Information goes here...</p>
            </div>
          </Card>
      </div>

        {/* Contact Form Card */}
        <h2 style={{ color: 'white', textAlign: 'center' }}>Contact Us</h2>
        <Card style={{ padding: '20px', border: '2px solid white', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
    <Form.Group controlId='formName'>
      <Form.Label style={{ color: 'white' }}>Your Name</Form.Label>
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
      <Form.Label style={{ color: 'white' }}>Your Email</Form.Label>
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
      <Form.Label style={{ color: 'white' }}>Your Message</Form.Label>
      <Form.Control
        as='textarea'
        rows={4}
        placeholder='Type your message here'
        name='message'
        value={formData.message}
        onChange={handleChange}
        required
        style={{ width: '100%'}}
      />
    </Form.Group>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant='primary' type='submit' className='custom-button'>
          Send
        </Button>
    </div>
  </Form>
</Card>
        {showSuccessMessage && (
          <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
            Form submitted successfully!
          </p>
        )}
      </div>
      <div style={{ position: 'fixed', top: '95%', left: '48%', transform: 'translate(-100%, -105%)', zIndex: '9999', display: 'flex' }}>
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
  );
};

export default ContactLoggedIn;
