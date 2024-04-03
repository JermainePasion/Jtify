import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { likeSong, unlikeSong } from '../actions/songActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


function Song({ song, playSong }) {
  const { id, picture, name, artist, } = song;
  const user = useSelector(state => state.userDetails.user);
  const likedSongs = useSelector(state => state.fetchLikedSongs.songs);
  const isLiked = likedSongs ? likedSongs.some(likedSong => likedSong.id === id) : false;
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const dispatch = useDispatch();
  
  const [liked, setLiked] = useState(isLiked);

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',
  };

  const imgStyle = {
    maxWidth: '200px',
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
    if (liked) {
      dispatch(unlikeSong(id));
    } else {
      dispatch(likeSong(id));
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
        <Link to={`/Artistprofile/${song.user}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {artist}
        </Link>
        <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} onClick={handleLike} style={{ cursor: 'pointer', color: liked ? '#fff' : '#fff', marginLeft: '10px' }} />
      </Card.Text>
        </Card.Body>
      </div>
    </Card>
  );
}

export default Song;