import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { listSongs } from '../../actions/songActions';
import Song from '../Song';

function Home() {
  const dispatch = useDispatch();
  const { loading, error, songs } = useSelector(state => state.songList);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  useEffect(() => {
    dispatch(listSongs());
  }, [dispatch]);

  const playSong = (song) => {
    if (currentlyPlaying === song) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(song);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
      <Navbar />
      <div style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        backgroundColor: 'black', 
        overflowX: 'auto', 
        padding: '10px 0',
        backgroundImage: `url(${process.env.PUBLIC_URL}/HomeBg.png)`,
        backgroundSize: 'cover',
      }}>
        <h1 style={{ color: 'white', fontFamily: 'Verdana', paddingLeft: '15px', fontSize: '30px', }}>Today's hits</h1>
        <div className="homepage-background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
        <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 0', overflowX: 'auto' }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            songs && songs.map(song => (
              <Song key={song.id} song={song} playSong={playSong} isPlaying={currentlyPlaying === song} />
            ))
          )}
      </div>

        {currentlyPlaying && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: 'black', color: '#fff', boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={currentlyPlaying.picture} alt="Album Art" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontFamily: 'Verdana', fontSize: '14px' }}>{currentlyPlaying.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8em' }}>{currentlyPlaying.artist}</p>
                </div>
              </div>
              <audio controls autoPlay style={{ width: '50%', maxWidth: '300px', margin: '0 10px' }}>
                <source src={currentlyPlaying.file} type="audio/mpeg" />
                Your browser does not support this audio player.
              </audio>
            </div>
          </div>
        )}
        </div>
      </div>
  );
}

export default Home;
