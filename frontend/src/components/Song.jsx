// Song.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function Song({ song, playSong }) {
  const { picture, name, artist } = song;
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  return (
    <Card className="my-3 p-3 rounded" style={{ color: '#fff', width: '250px', marginRight: '10px', padding: '10px', fontFamily: selectedFont }}>
 
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card.Img
          src={picture}
          alt={name}
          style={{ maxWidth: '230px', cursor: 'pointer', borderRadius: '15px' }}
          onClick={() => playSong(song)}
        />
      </div>
      <Card.Body style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <Card.Title as="div" style={{ marginBottom: '5px', fontSize: '15px', maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%', fontFamily: selectedFont }}>
            <strong>{name}</strong>
          </Card.Title>
        </div>
        <Card.Text as="div" style={{ fontSize: '14px', color: '#d8d4d9', fontFamily: selectedFont}}>
          <div style={{ fontFamily: selectedFont }}>{artist}</div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Song;
