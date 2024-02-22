import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Card, Button } from 'react-bootstrap';
import Navbar from '../Navbar';
import { fetchLikedSongs, unlikeSong } from '../../actions/songActions';
import { getUserDetails } from '../../actions/userActions';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const Favorites = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const likedSongs = useSelector((state) => state.fetchLikedSongs.songs); // Access the songs array
  const [currentSong, setCurrentSong] = useState(null);

  // Local state to track liked songs
  const [likedSongsState, setLikedSongsState] = useState({});

  const handleSongClick = (song) => {
    if (currentSong === song.file) {
      setCurrentSong(null); // Pause the song if it's already playing
    } else {
      setCurrentSong(song.file); // Start playing the clicked song
    }
  };

  useEffect(() => {
    dispatch(getUserDetails()); // Fetch user details when the component mounts
  }, [dispatch]);

  useEffect(() => {
    if (user && user.data && user.data.user_data && user.data.user_data.id) {
      dispatch(fetchLikedSongs(user.data.user_data.id));
    }
  }, [dispatch, user?.data?.user_data?.id]);

  useEffect(() => {
    // Initialize likedSongsState when likedSongs changes
    const initialLikedSongsState = likedSongs.reduce((acc, song) => {
      acc[song.id] = true;
      return acc;
    }, {});
    setLikedSongsState(initialLikedSongsState);
  }, [likedSongs]);

  const handleUnlike = (id) => {
    dispatch(unlikeSong(id)).then(() => {
      // After successful unlike, update the UI by removing the liked song from the state
      const updatedLikedSongs = likedSongs.filter(song => song.id !== id);
      dispatch({ type: 'UPDATE_LIKED_SONGS', payload: updatedLikedSongs });

      // Update likedSongsState
      setLikedSongsState(prevState => ({ ...prevState, [id]: false }));
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div className='template-background' style={{ flex: 1 }}>
        <Container fluid>
          <h2 className="mt-3 mb-3" style={{ color: 'white' }}>Liked Songs</h2>
          <Row>
            {likedSongs.map((likedSong, index) => (
              <Card key={index} className="my-3 mr-3 p-3 rounded" style={{ color: '#fff', width: '250px', fontFamily: selectedFont }}>
                <img
                  src={likedSong.picture}
                  alt={likedSong.name}
                  style={{ maxWidth: '230px', cursor: 'pointer', borderRadius: '15px' }}
                  onClick={() => handleSongClick(likedSong)}
                />
                <div style={{ textAlign: 'center' }}>
                  <Card.Title as="div" style={{ margin: '5px 0', fontSize: '18px', color: '#fff' }}>
                    <strong>{likedSong.name}</strong>
                  </Card.Title>
                  <Card.Text as="div" style={{ fontSize: '16px', color: '#d8d4d9' }}>
                    Artist: {likedSong.artist}
                  </Card.Text>
                  <Button variant="link" onClick={() => handleUnlike(likedSong.id)} style={{ color: 'inherit', background: 'transparent', border: 'none' }}>
                    {likedSongsState[likedSong.id] ? (
                      <AiFillHeart size={24} color="#e74c3c" />
                    ) : (
                      <AiOutlineHeart size={24} color="#e74c3c" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </Row>
        </Container>
      </div>
      {currentSong && (
        <audio controls>
          <source src={currentSong} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default Favorites;