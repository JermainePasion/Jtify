import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyOTP, resendOTP } from '../../actions/userActions';
import { Card, Form } from 'react-bootstrap';
import FormContainer from '../FormContainer';

function OTPVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [otp_code, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false); // New state variable

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams(location.search);
      const user_id = queryParams.get('user_id');
      const otp_id = queryParams.get('otp_id');

      // Dispatch the verifyOTP action with user_id, otp_id, and otp_code
      const response = await dispatch(verifyOTP(user_id, otp_id, otp_code));

      if (response) {
        console.log('Redirecting to login');
        navigate('/');
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      setError('Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const user_id = queryParams.get('user_id');
      const otp_id = queryParams.get('otp_id');
  
      console.log('user_id:', user_id);
      console.log('otp_id:', otp_id);
  
      // Dispatch the resendOTP action with user_id and otp_id
      const response = await dispatch(resendOTP(user_id, otp_id));
  
      if (response && response.message) {
        console.log('Resent OTP successfully');
        setResendSuccess(true);
      } else {
        setResendSuccess(false);
        setError('Failed to resend OTP');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to resend OTP');
    }
  };
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '400px', padding: '20px', border: '2px solid white', borderRadius: '10px' }}>
        <FormContainer>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Verify OTP</h1>

          <Form.Label style={{ color: 'white' }}>OTP</Form.Label>
          <Form onSubmit={handleVerifyOTP}>
            <Form.Group controlId='otp'>
              <Form.Control
                className='form-control'
                type='text'
                placeholder='Enter OTP'
                value={otp_code}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>

            <button className='login-button glow-button' type="submit">
              Verify OTP
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <button className='login-button glow-button' type="button" onClick={handleResendOTP}>
                Resend OTP
              </button>
            </div>

            {resendSuccess && <p style={{ color: 'green', textAlign: 'center' }}>Resent successfully!</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          </Form>
        </FormContainer>

        <div className="background">
          <div className="logo-image">
            <img src="Jlogo.png" alt="background" width={200} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default OTPVerification;
