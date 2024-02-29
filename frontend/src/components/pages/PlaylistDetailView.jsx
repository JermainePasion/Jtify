import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Spinner, Nav } from 'react-bootstrap'; // Import Nav from react-bootstrap
import { playlistDetailView } from '../../actions/songActions';
import { getUserDetails } from '../../actions/userActions';
import Navbar from '../Navbar';

const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, playlist, error } = useSelector((state) => state.playlistDetail);
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    console.log('Fetching playlist details...');
    dispatch(getUserDetails());
    dispatch(playlistDetailView(id));
  }, [dispatch, id]);

  const handleGoBack = () => {
    window.history.back(); // Go back to the previous page
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont }}>
      <Navbar />
      <div style={{ flex: 1, padding: '20px', color: 'white' }}>
        <Container>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" style={{ marginBottom: '20px' }} onClick={handleGoBack}>
              Back to Home
            </Button>
          </Link>
          {/* Add a button to navigate to the add songs page */}
          {/* <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Nav.Link href="/add-songs" style={{ color: 'white' }}>Add song</Nav.Link>
          </div> */}
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            playlist && (
              <div>
                <h2>{playlist.name}</h2>
                <p>Created by: {user?.data?.user_data?.name}</p>
                <p>Number of Songs: {playlist.songs.length}</p>
                <img src={playlist.playlistCover} alt="Playlist Cover" style={{ width: '300px', height: '300px', borderRadius: '15px', marginBottom: '20px' }} />
                <h3>Songs Included:</h3>
                {playlist.songs.map((song) => (
                  <div key={song.id}>
                    <h4>Name: {song.name}</h4>
                    <img src={song.picture} alt="Album Cover" style={{ width: '100px', height: '100px', borderRadius: '15px', marginBottom: '20px' }} />
                    <p>Artist: {song.artist}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </Container>
      </div>
    </div>
  );
};

export default PlaylistDetails;
