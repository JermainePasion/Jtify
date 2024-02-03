import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { Card, Button } from 'react-bootstrap';
import { logout } from '../../actions/userActions';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to the login page after logout
  };

  // Sample song data
  const songs = [
    { id: 1, title: 'Song 1' },
    { id: 2, title: 'Song 2' },
    { id: 3, title: 'Song 3' },
    // Add more songs as needed
  ];

  return (
    <div style={{ display: 'flex', backgroundColor: 'black' }}>
      <Navbar />
      
      <div style={{ marginLeft: '10px', position: 'relative' }}>
        <Card style={{ width: '1200px', padding: '20px', borderRadius: '10px', backgroundColor: 'transparent', margin: 0, opacity: 0.9 }}>
          <div className="homepage-background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
          
          <Card.Body style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', position: 'relative' }}>
            <Button variant="danger" onClick={handleLogout} style={{ position: 'absolute', top: '10px', left: '800px',}}>
              Logout
            </Button>
            
            {/* Map through the songs array and create a Card.Text for each song */}
            {songs.map(song => (
              <Card.Text key={song.id} style={{ color: 'white', marginRight: '10px', marginBottom: '10px' }}>{song.title}</Card.Text>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Home;
