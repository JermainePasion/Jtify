// OTPVerification.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyOTP } from '../../actions/userActions';

function OTPVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams(location.search);
      const user_id = queryParams.get('user_id');
      const otp_id = queryParams.get('otp_id');

      const response = await dispatch(verifyOTP(user_id, otp_id, otp));

      if (response) {
        console.log('Redirecting to login');
        navigate('/login');
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      setError('Invalid OTP');
    }
  };

  return (
    <div>
      <form onSubmit={handleVerifyOTP}>
        <label>
          OTP:
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </label>
        <button type="submit">Verify OTP</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default OTPVerification;
