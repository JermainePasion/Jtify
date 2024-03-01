import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Spinner, Image } from 'react-bootstrap'; // Import Image from react-bootstrap
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
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            playlist && (
              <div style={{ position: 'relative' }}>
                <div className='template-background' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <Image src={playlist.playlistCover} alt="Liked" style={{ width: '250px', height: '250px', objectFit: 'contain', marginLeft: '10px' }} />
                  <div style={{ marginLeft: '10px' }}>
                    {/* <p style={{ color: 'white', fontFamily: selectedFont }}>Playlist</p> */}
                    <h2 className="mt-3 mb-3" style={{ color: 'white', fontSize: '50px', fontFamily: selectedFont }}>{playlist.name}</h2>
                    <p style={{ color: 'white', fontSize: '20px', fontFamily: selectedFont }}>Created by: {user?.data?.user_data?.name}</p>
                    <p style={{ color: 'white', fontSize: '20px', fontFamily: selectedFont }}>Number of Songs: {playlist.songs.length}</p>
                  </div>
                </div>
                <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '24px', fontFamily: selectedFont }}>Songs Included:</h3>
                {playlist.songs.map((song) => (
                  <div key={song.id} style={{ marginBottom: '20px' }}>
                    <Link to={`/songs/${song.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: '5px', fontFamily: selectedFont }}>{song.name}</h4>
                      <Image src={song.picture} alt="Album Cover" style={{ width: '100px', height: '100px', borderRadius: '15px' }} />
                      <p style={{ marginBottom: '5px', fontFamily: selectedFont }}>Artist: {song.artist}</p>
                    </Link>
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
