import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHome, FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';
import { BsDoorOpenFill,BsFire,BsList, BsPersonSquare, BsFillHeartFill, BsFillTelephoneFill, BsBrowserSafari, BsMusicNoteList } from "react-icons/bs";
import { useSelector } from 'react-redux';


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const user = useSelector(state => state.userDetails.user);
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';


  

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
  
    <div style={{ position: 'relative', top: '10px', left: '-50px', marginBottom: '20px'}}>
      <img src="/Jlogo.png" alt="background" width={200} onClick={goToHome} />
    </div>
  
    <Card style={{marginTop: '150px', width: '280px', padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.18)', margin: '5px', opacity: 0.9 }}> 
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
      <h1 style={{ direction: 'ltr' }}>
        <button className='Navbar-items' onClick={goToPlans} style={{ fontFamily: selectedFont }}>
          <BsList /> Subscription
        </button>
      </h1>
    </Card>
  
    <Card style={{marginTop: '20px', width: '280px', padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.18)', margin: '5px', opacity: 0.9, marginBottom: '150px' }}> 
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
