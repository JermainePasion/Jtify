// ConfirmChangePass.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ConfirmChangePass() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleConfirmResetPassword = async () => {
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
      // You can redirect the user after successful confirmation if needed
      // Example: history.push('/login');
    } catch (error) {
      // Handle errors
      console.error('Error confirming reset password:', error.message);
    }
  };

  useEffect(() => {
    // Optional: You can add additional logic here if needed when the component mounts
    // For example, check if uid and token are present in the URL
    // and take appropriate actions
  }, []);

  return (
    <div>
      <h2>Confirm Reset Password</h2>
      <form>
        <label>New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <label>Confirm New Password:</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <br />

        <button type="button" onClick={handleConfirmResetPassword}>
          Confirm Reset Password
        </button>
      </form>
    </div>
  );
}

export default ConfirmChangePass
