import React from 'react'
import Navbar from '../Navbar'
import { useSelector } from 'react-redux'

const Contact = () => {
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily:selectedFont }}>
    <Navbar />
    <div className='template-background'>
        <h1 style={{ color: 'white' }}>Contact Page</h1>
      </div>

    </div>

  )
}

export default Contact
