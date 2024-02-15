import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { likedSongsList } from '../../actions/userActions'; // Update the path to your actions

const Favorites = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userDetails.user);
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';
  const likedSongs = useSelector(state => state.likedSongsList); // Assuming you have a reducer for liked songs

   // Assuming likedSongs is initially undefined
  const likedSongsData = likedSongs && likedSongs.likedSongs; // Check if likedSongs is not undefined before accessing likedSongs.likedSongs

  useEffect(() => {
    if (user) {
      const userId = user?.data?.id;
      dispatch(likedSongsList(userId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    console.log('userInfo:', user); // Log userInfo here
  }, [user]); 



return (
  <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily:selectedFont }}>
    <Navbar />
    <div className='template-background'>
      <h1 style={{ color: 'white' }}>Favorites page</h1>
      <div>
        {likedSongs.loading ? (
          <p>Loading...</p>
        ) : likedSongs.error ? (
          <p>Error: {likedSongs.error}</p>
        ) : likedSongsData ? ( // Check if likedSongsData is not undefined
          <ul>
            {likedSongsData.map(song => (
              <li key={song.id}>
                <h3>{song.name}</h3>
                <p>Artist: {song.artist}</p>
                <img src={song.picture} alt={song.name} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No liked songs found.</p>
        )}
      </div>
    </div>
  </div>
);
        };

export default Favorites;