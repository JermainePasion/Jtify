import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from '../Navbar';
import { fetchLikedSongs } from '../../actions/songActions';

const Favorites = () => {
   const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const likedSongs = useSelector((state) => state.fetchLikedSongs.songs); // Access the songs array
  useEffect(() => {
    dispatch(fetchLikedSongs());
  }, [dispatch]);

  // Ensure likedSongs is not null or undefined before rendering
  if (!likedSongs) {
    return (
      <div>Loading...</div>
    );
}

console.log('Liked Songs State:', likedSongs);
console.log('Liked Songs Type:', typeof likedSongs);

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
    <Navbar />
    <div className='template-background'>
      <Container fluid>
        <h2 className="mt-3 mb-3">Liked Songs</h2>
        <Row>
          {likedSongs && likedSongs.songs && likedSongs.songs.map((likedSong) => (
            <Col key={likedSong} md={3} className="mb-3">
              <Card>
                <Card.Img variant="top" src={likedSong.picture} />
                <Card.Body>
                  <Card.Title>{likedSong.name}</Card.Title>
                  <Card.Text>
                    Artist: {likedSong.artist}
                  </Card.Text>
                  <Card.Text>
                    Genre: {likedSong.genre}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  </div>
  );
};

export default Favorites;
