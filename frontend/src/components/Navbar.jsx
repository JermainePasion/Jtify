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
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: selectedFont,}}>
      <div style={{top: '20px', left: '20px', display:'flex', marginRight: '100px', }}>
      <img src="/Jlogo.png" alt="background" width={200} onClick={goToHome} />
      </div>

    
      <Card style={{marginTop: '110px', height: '700px', width: '280px', padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.18)', margin: '5px', opacity: 0.9 }}> <h1>
      {/* <img src="/Jlogo.png" alt="background" width={200} onClick={goToHome} position="fixed"/> */}
          <button className='Navbar-items' onClick={goToHome} style={{ fontFamily: selectedFont }}>
            <FaHome /> Home
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToFavorites} style={{ fontFamily: selectedFont }}>
            <BsFillHeartFill /> Favorites
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToDiscovery} style={{ fontFamily: selectedFont }}>
            <BsBrowserSafari /> Discovery
          </button>
        </h1>

        <h1>
          <button className='Navbar-items' onClick={goToArtistRegister} style={{ fontFamily: selectedFont }}>
          <BsMusicNoteList /> Be an Artist
          </button>
        </h1>

        <h1>
          <button className='Navbar-items' onClick={goToAddSong} style={{ fontFamily: selectedFont }}>
            <BsMusicNoteList /> Add Song
          </button>
        </h1>

        <h1>
          <button className='Navbar-items' onClick={goToMySongs} style={{ fontFamily: selectedFont }}>
            <BsMusicNoteList /> My Songs
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToMyPlaylist} style={{ fontFamily: selectedFont }}>
            <BsFire /> My Playlist
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToAds} style={{ fontFamily: selectedFont }}>
            <BsList /> Ads
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToPlans} style={{ fontFamily: selectedFont }}>
            <BsList /> Plans
          </button>
        </h1>
      </Card>
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
        <h1>
          <button className='Navbar-items' onClick={goToAdminPanel} style={{ fontFamily: selectedFont }}>
          <BsList /> Admin Panel
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
