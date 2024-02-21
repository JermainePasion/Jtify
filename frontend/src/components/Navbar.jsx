import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHome, FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';
import { BsDoorOpenFill, BsFire, BsPersonSquare, BsFillHeartFill, BsFillTelephoneFill } from "react-icons/bs";
import { useSelector } from 'react-redux';



const Navbar = () => {
  // Function to handle navigation to the home page
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout(navigate)); // Pass navigate to the logout action
  };

  const user = useSelector(state => state.userDetails.user);
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  const goToHome = () => {
    // Navigate to the home page
    navigate('/home');
  };

  // Function to handle navigation to the search page
  const goToSearch = () => {
    // Navigate to the search page
    navigate('/search');
  };

  const goToProfile = () => {
    // Navigate to the profile page
    navigate('/profile');
  };

  const goToContact = () => {
    // Navigate to the contact page
    navigate('/contact');
  };

  const goToAddSong = () => {
    // Navigate to the add song page
    navigate('/add-songs');
  };

  const goToFavorites = () => {
    // Navigate to the favorites page
    navigate('/favorites');
  };

  const goToDiscovery = () => {
    // Navigate to the contact page
    navigate('/discovery');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: selectedFont }}>
      {/* Top Card*/}
      <Card style={{ height: '600px', width: '280px', padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.18)', margin: '5px', opacity: 0.9 }}>
        <h1>
          <button className='Navbar-items' onClick={goToHome} style={{ fontFamily: selectedFont }}>
            <FaHome /> Home
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToHome} style={{ fontFamily: selectedFont }}>
            <FaSearch /> Search
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToFavorites} style={{ fontFamily: selectedFont }}>
            <BsFillHeartFill /> Favorites
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToDiscovery} style={{ fontFamily: selectedFont }}>
            <BsFillTelephoneFill /> Discovery
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToAddSong} style={{ fontFamily: selectedFont }}>
            <BsFire /> Add Song
          </button>
        </h1>
      </Card>
      {/* Bottom Card*/}
      <Card style={{ width: '300px', padding: '10px', borderRadius: '5px', backgroundColor: 'rgba(255, 255, 255, 0.18)', margin: '5px', opacity: 0.9, height: '250px' }}>
        <h1>
          <button className='Navbar-items' onClick={goToProfile} style={{ fontFamily: selectedFont }}>
            <BsPersonSquare /> Profile
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToContact} style={{ fontFamily: selectedFont }}>
            <BsFillTelephoneFill /> Contact Us
          </button>
        </h1>
        <Button className='Navbar-items' onClick={handleLogout} style={{ fontFamily: selectedFont }}>
          <BsDoorOpenFill /> Logout
        </Button>
      </Card>
    </div>
  );
}

export default Navbar;
