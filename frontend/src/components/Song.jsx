// Song.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Song({ song, playSong }) {
  const { picture, name, artist } = song;
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none', // Remove underline
  };

  const imgStyle = {
    maxWidth: '230px',
    marginLeft: '18px',
    cursor: 'pointer',
    borderRadius: '15px',
  };

  const titleStyle = {
    margin: '5px 0',
    fontSize: '18px',
    fontFamily: selectedFont,
    color: '#fff', // White text color
  };

  const artistStyle = {
    fontSize: '16px',
    color: '#d8d4d9',
    fontFamily: selectedFont,
  };

  return (
    <Card className="my-3 p-3 rounded" style={{ color: '#fff', width: '250px', marginRight: '10px', padding: '10px', fontFamily: selectedFont }}>
        <Card.Img
          src={picture}
          alt={name}
          style={imgStyle}
          onClick={() => playSong(song)}
        />
      <Link to={`/songs/${song.id}`} style={cardStyle}>
        <Card.Body>
          <Card.Title as="div" style={titleStyle}>
            <strong>{name}</strong>
          </Card.Title>
          <Card.Text as="div" style={artistStyle}>
            {artist}
          </Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default Song;
