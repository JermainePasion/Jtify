import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const playlists = state.songList.playlists.map(playlist => ({
    ...playlist,
    numberOfSongs: playlist.songs.length,
  }));
  return { playlists };
};

const Playlist = ({ playlist }) => {
  console.log('Playlist:', playlist);
  const user = useSelector((state) => state.userDetails.user);
  return (
    <Card className="my-3 p-3 rounded" style={{ color: '#fff', width: '250px', marginRight: '10px', padding: '10px', fontFamily: 'Arial' }}>
      <Link to={`/playlist/${playlist.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img src={playlist.playlistCover} alt="Playlist Cover" style={{ width: '200px', height: '200px' }} />
        <Card.Body>
          <Card.Title as="div" style={{ margin: '5px 0', fontSize: '18px', color: '#fff' }}>
            <strong>{playlist.name}</strong>
          </Card.Title>
          <Card.Text as="div" style={{ fontSize: '16px', color: '#d8d4d9' }}>
            Number of songs: {playlist.numberOfSongs || 0}
          </Card.Text>
          <Card.Text as="div" style={{ fontSize: '16px', color: '#d8d4d9' }}>
          
          </Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default connect(mapStateToProps)(Playlist);
