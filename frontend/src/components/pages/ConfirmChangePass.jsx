import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap'; // Add missing imports
import JTIFY from '../img/JTIFY.png';

function ConfirmChangePass() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/reset-password/${uid}/${token}/`,
        {
          password,
          password2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle the response as needed
      console.log('Confirm Reset Password Response:', response.data);

      // Redirect to the login page after successful confirmation
      navigate('/');
    } catch (error) {
      // Handle errors
      console.error('Error confirming reset password:', error.message);
    }
  };

  useEffect(() => {
    // Optional: You can add additional logic here if needed when the component mounts
    // For example, check if uid and token are present in the URL
    // and take appropriate actions
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000000'}}>
      <Card style={{ width: '400px', padding: '20px', border: '2px solid white', borderRadius: '10px', zIndex: '2'}}>
        <Form onSubmit={submitHandler}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Confirm Change Password</h1>

          <Form.Label style={{ color: 'white' }}>New Password</Form.Label>
          <Form.Group controlId='password'>
            <Form.Control
              className='form-control'
              type="password"
              placeholder='Enter new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Label style={{ color: 'white' }}>Confirm Password</Form.Label>
          <Form.Group controlId='password2'>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Form.Group>

          <Button className='login-button glow-button' type='submit' variant='primary'>
            Confirm
          </Button>
        </Form>

        <div className="background" style={{
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    overflow: 'hidden', /* To ensure the image doesn't overflow */
    zIndex:'1'
}}>
    <img src={JTIFY} style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover', /* This will make the image cover the entire container */
        zIndex:'2'
    }} />
</div>
          <div className="logo-image">
            <img src="Jlogo.png" alt="background" width={200} />
          </div>
        
      </Card>
    </div>
  );
}

export default ConfirmChangePass;
