import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHome, FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';
import { BsDoorOpenFill, BsFire, BsPersonSquare, BsFillHeartFill  } from "react-icons/bs";

const Navbar = () => {
  // Function to handle navigation to the home page
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to the login page after logout
  };
  const goToHome = () => {
    // Navigate to the home page
    window.location.href = '/home';
  };

  // Function to handle navigation to the search page
  const goToSearch = () => {
    // Navigate to the search page
    window.location.href = '/search';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
    
      {/* Top Card*/}
      <Card style={{ height: '600px', width: '280px', padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.18)', margin: '5px', opacity: 0.9 }}>

        <h1>
          <button className='Navbar-items' onClick={goToHome}>
            <FaHome /> Home
          </button>
        </h1>
          
        <h1>
          <button className='Navbar-items' onClick={goToSearch}>
            <FaSearch /> Search
          </button>
        </h1>

        <h1 >
          <button className='Navbar-items' onClick={goToHome}>
            <BsFire /> Trending
          </button>
        </h1>
        <h1>
          <button className='Navbar-items' onClick={goToHome}>
            <BsFillHeartFill /> Favorites
          </button>
        </h1>
      </Card>

      {/* Bottom Card*/}
      <Card style={{ width: '300px', padding: '10px', borderRadius: '5px', backgroundColor: 'rgba(255, 255, 255, 0.18)', margin: '5px', opacity: 0.9, height: '250px' }}>

        <h1>
          <button className='Navbar-items' onClick={goToHome}>
            <BsPersonSquare /> Profile
          </button>
        </h1>
        <Button className='Navbar-items' onClick={handleLogout}>
          <BsDoorOpenFill /> Logout 
        </Button>
      </Card>
    </div>
  );
}

export default Navbar;