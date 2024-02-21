import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link
import { likeSong } from '../actions/songActions';

function Song({ song, playSong }) {
  const { id, picture, name, artist } = song;
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const dispatch = useDispatch();

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',
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
    color: '#fff',
  };

  const artistStyle = {
    fontSize: '16px',
    color: '#d8d4d9',
    fontFamily: selectedFont,
  };

  const handleLike = () => {
    dispatch(likeSong(id)); // Dispatch the likeSong action with the song ID
  };
  
  return (
    <Card className="my-3 p-3 rounded" style={{ color: '#fff', width: '250px', marginRight: '10px', padding: '10px', fontFamily: selectedFont }}>
      <Card.Img
        src={picture}
        alt={name}
        style={imgStyle}
        onClick={() => playSong(song)}
      />
      <div style={cardStyle}>
        <Card.Body>
          <Link to={`/songs/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Wrap the name and artist with Link */}
            <Card.Title as="div" style={titleStyle}>
              <strong>{name}</strong>
            </Card.Title>
            <Card.Text as="div" style={artistStyle}>
              {artist}
            </Card.Text>
          </Link>
          <Button onClick={handleLike} variant="primary">Like</Button> {/* Add the Like Button */}
        </Card.Body>
      </div>
    </Card>
  );
}

export default Song;
