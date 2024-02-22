import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { likeSong, unlikeSong } from '../actions/songActions';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

function Song({ song, playSong }) {
  const { id, picture, name, artist } = song;
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);

  // Load liked songs from localStorage on component mount
  useEffect(() => {
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
    setLiked(likedSongs.includes(id));
  }, [id]);

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
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
    if (liked) {
      dispatch(unlikeSong(id));
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs.filter(songId => songId !== id)));
    } else {
      dispatch(likeSong(id));
      localStorage.setItem('likedSongs', JSON.stringify([...likedSongs, id]));
    }
    setLiked(!liked);
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
          <Card.Title as="div" style={titleStyle}>
            <strong>{name}</strong>
          </Card.Title>
          <Card.Text as="div" style={artistStyle}>
            {artist}
          </Card.Text>
          <Button
            onClick={handleLike}
            variant="link"
            style={{ color: 'inherit', background: 'transparent', border: 'none' }}
          >
            {liked ? (
              <AiFillHeart size={24} color="#e74c3c" />
            ) : (
              <AiOutlineHeart size={24} color="#e74c3c" />
            )}
          </Button>
        </Card.Body>
      </div>
    </Card>
  );
}

export default Song;
