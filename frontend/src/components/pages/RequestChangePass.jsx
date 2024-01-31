// RequestChangePass.js

import React, { useState } from 'react';
import axios from 'axios';

function RequestChangePass() {
  const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [requestpass, setRequestpass] = useState('');

  const handleRequestPass = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/user/send-reset-password-email/',
        {
          email,
        //   password,
        //   requestpass,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle the response as needed
      console.log('Request Password Response:', response.data);
    } catch (error) {
      // Handle errors
      console.error('Error making request password API call:', error.message);
    }
  };

  return (
    <div>
      <h2>Request Password Change</h2>
      <form>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        {/* <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <label>Request Password:</label>
        <input
          type="text"
          value={requestpass}
          onChange={(e) => setRequestpass(e.target.value)}
        />
        <br /> */}

        <button type="button" onClick={handleRequestPass}>
          Request Password Submit
        </button>
      </form>
    </div>
  );
}

export default RequestChangePass;
