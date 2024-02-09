import React from 'react'
import Navbar from '../Navbar';

function Profile() {
  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
    <Navbar />
    <div className='template-background' >
        <h1 style={{ color: 'white' }}>Profile Page </h1>
      </div>

    </div>
  )
}

export default Profile