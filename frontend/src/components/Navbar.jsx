import React from 'react';
import { Card } from 'react-bootstrap';
import { FaHome, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  // Function to handle navigation to the home page
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
      <Card style={{ width: '300px', padding: '10px', borderRadius: '5px', backgroundColor: 'rgb(24,24,24)', margin: '5px', opacity: 0.9, height: '100px' }}>
        <div style={{ color: 'white' }}>
        
          <h3>
            <button onClick={goToHome} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '17px', padding: '5px', marginLeft: '10px' }}>
              <FaHome /> Home
            </button>
          </h3>
          
          <h3>
            <button onClick={goToSearch} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '17px', padding: '5px', marginLeft: '10px' }}>
              <FaSearch /> Search
            </button>
          </h3>
        </div>
      </Card>

      {/* Bottom Card*/}
      <Card style={{ height: '640px', width: '280px', padding: '20px', borderRadius: '10px', backgroundColor: 'rgb(24,24,24)', margin: '5px', opacity: 0.9 }}>
        <h1 style={{ color: 'white' }}>content</h1>
        <h1 style={{ color: 'white' }}>content</h1>
        <h1 style={{ color: 'white' }}>content</h1>
        <h1 style={{ color: 'white' }}>content</h1>
        <h1 style={{ color: 'white' }}>content</h1>
      </Card>
    </div>
  );
}

export default Navbar;
