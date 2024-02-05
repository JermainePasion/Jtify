import React from 'react';
import { Card } from 'react-bootstrap';

function Song({ song, playSong, /* isPlaying */ }) {
  const {/*  id,  */picture, name, artist } = song;

  return (
    <Card className="my-3 p-3 rounded" style={{ color: '#fff', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '25px' }}>
        <Card.Img
          src={picture}
          alt={name}
          style={{ maxWidth: '150px', cursor: 'pointer', borderRadius: '10px' }}
          onClick={() => playSong(song)}
        />
      </div>

      <Card.Body style={{ paddingLeft: '35px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <Card.Title as="div" style={{ marginBottom: '5px', fontSize: '15px', maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%', font: 'Helvetica World'}}>
            <strong>{name}</strong>
          </Card.Title>
        </div>

        <Card.Text as="div" style={{ fontSize: '14px' }}>
          <div>{artist}</div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Song;
