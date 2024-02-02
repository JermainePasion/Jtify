import React from 'react';
import Navbar from '../Navbar';
import { Card } from 'react-bootstrap';

function Home() {
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
        <Card style={{ width: '1200px', padding: '20px', borderRadius: '10px', backgroundColor: 'transparent', margin: 0, opacity: 0.9}}>
          <div className="homepage-background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
          <Card.Body style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
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
