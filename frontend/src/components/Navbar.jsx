import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';
import { BsDoorOpenFill,BsFire,BsList, BsPersonSquare, BsFillHeartFill, BsFillTelephoneFill, BsBrowserSafari, BsMusicNoteList } from "react-icons/bs";
import { useSelector } from 'react-redux';
import '../App.css';
import Jlogo from './img/Jlogo.png'
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const user = useSelector(state => state.userDetails.user);
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  const [showNavbar, setShowNavbar] = useState(true)
  
  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const goToHome = () => {
    navigate('/home');
  };

  const goToPlans = () => {
    navigate('/plans');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToContact = () => {
    navigate('/contact');
  };

  const goToAddSong = () => {
    navigate('/add-songs');
  };

  const goToFavorites = () => {
    navigate('/favorites');
  };

  const goToDiscovery = () => {
    navigate('/discovery');
  };

  const goToMySongs = () => {
    navigate('/mysongs');
  };

  const goToMyPlaylist = () => {
    navigate('/myplaylist');
  };

  const goToAds = () => {
    navigate('/ads');
  }

  const goToAdminPanel = () => {
    navigate('/adminpanel');
  };

  const goToArtistRegister = () => {
    navigate('/artistregister');
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'flex-start', fontFamily: selectedFont, position: 'relative', overflowY: 'auto', maxHeight: 'calc(100vh - 20px)', direction: 'rtl' }}>
  
  <div
  style={{
    marginTop: '30px',
    position: 'relative', // Keep the position relative
    right: window.innerWidth <= 768 ? '10px' : '0', // Move to the right by 10px on smaller screens
    bottom: '20px', // Adjusted to place it 20px from the bottom
    marginBottom: '0px', // Adjusted marginBottom
  }}
>
  <img
    src={Jlogo}
    alt="background"
    width={window.innerWidth <= 768 ? '180px' : '180px'} // Adjusted image width for smaller screens
    height={window.innerWidth <= 768 ? '90px' : '90px'}
    // Adjusted image height for smaller screens
    onClick={goToHome}
  />
</div>
  
    <Card className="navbar-card" style={{ marginTop: '0px'}}>
      <h1 style={{ direction: 'ltr' }}>
        
        <button className='Navbar-items' onClick={goToHome} style={{ fontFamily: selectedFont }}>
          <FaHome /> Home
        </button>
      </h1>
      <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToFavorites} style={{ fontFamily: selectedFont }}>
          <BsFillHeartFill /> Favorites
        </button>
      </h1>
      <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToDiscovery} style={{ fontFamily: selectedFont }}>
          <BsBrowserSafari /> Discovery
        </button>
      </h1>
      <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToArtistRegister} style={{ fontFamily: selectedFont }}>
        <BsMusicNoteList /> Be an Artist
        </button>
      </h1>
  
      {(user?.data?.user_data?.is_superuser || user?.data?.user_data?.is_artist) && (
        <>
          <h1 style={{ direction: 'ltr' }}>
            <button className='Navbar-items' onClick={goToAddSong} style={{ fontFamily: selectedFont }}>
              <BsMusicNoteList /> Add Song
            </button>
          </h1>
          <h1 style={{ direction: 'ltr' }}>
            <button className='Navbar-items' onClick={goToMySongs} style={{ fontFamily: selectedFont }}>
              <BsMusicNoteList /> My Songs
            </button>
          </h1>
          <h1 style={{ direction: 'ltr' }}>
            <button className='Navbar-items' onClick={goToMyPlaylist} style={{ fontFamily: selectedFont }}>
              <BsFire /> My Playlist
            </button>
          </h1>
        </>
      )}
      
      {(user?.data?.user_data?.is_superuser) && (
        <> 
        <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToAds} style={{ fontFamily: selectedFont }}>
          <BsList /> Ads
        </button>
      </h1>
      </> 
      )}

      {(!user?.data?.user_data?.is_superuser || !user?.data?.user_data?.is_artist || !user?.data?.user_data?.is_subscriber) &&
      <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToPlans} style={{ fontFamily: selectedFont }}>
          <BsList /> Subscription
        </button>
      </h1>
      }
    </Card>
  
    <Card className="navbar-card" style={{ marginBottom: '120px'}}>
      <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToProfile} style={{ fontFamily: selectedFont }}>
          <BsPersonSquare /> Profile
        </button>
      </h1>
      <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToContact} style={{ fontFamily: selectedFont }}>
          <BsFillTelephoneFill /> Contact Us
        </button>
      </h1>
      {user?.data?.user_data?.is_superuser && (
        <h1 style={{ direction: 'ltr' }}>
          <button className='Navbar-items' onClick={goToAdminPanel} style={{ fontFamily: selectedFont }}>
            <BsList /> Admin Panel
          </button>
        </h1>
      )}
      <h1 style={{ direction: 'ltr' }}>
      <Button className='Navbar-items-logout' onClick={handleLogout} style={{ fontFamily: selectedFont }}>
        <BsDoorOpenFill /> Logout
      </Button>
      </h1>
    </Card>
    
  </div>
  
  );
}

export default Navbar;
