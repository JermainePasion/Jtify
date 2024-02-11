import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listSongs } from '../../actions/songActions'; // Import the action to fetch songs
import Navbar from '../Navbar';
import axios from 'axios';

function Favorites() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.songList); // Assuming songList reducer contains loading and error state
  const { userInfo } = useSelector((state) => state.userLogin); // Assuming you store user info in Redux state
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    console.log('Fetching all songs...');
    dispatch(listSongs()); // Fetch all songs when the component mounts
  }, [dispatch]);

  useEffect(() => {
    // Fetch liked songs when userInfo is available
    if (userInfo) {
      console.log('User info available. Fetching liked songs...');
      fetchLikedSongsForAllSongs();
    }
  }, [userInfo]);

  // Function to fetch liked songs for all songs
  const fetchLikedSongsForAllSongs = async () => {
    try {
      // Fetch all songs first
      const allSongsResponse = await axios.get('/api/songs/');
      const allSongs = allSongsResponse.data;
      console.log('All songs:', allSongs);

      // Fetch liked songs for each song
      const likedSongsForAllSongs = [];
      for (const song of allSongs) {
        const likedSongsResponse = await axios.get(`/api/songs/${song.id}/likes/`);
        const likedSongs = likedSongsResponse.data;
        console.log(`Liked songs for song with ID ${song.id}:`, likedSongs);
        if (likedSongs.includes(userInfo.id)) {
          // Dispatch the listSongs action for the current song
          dispatch(listSongs(song.id));
          likedSongsForAllSongs.push({ songId: song.id, likedSongs });
        }
      }

      // Update the likedSongs state
      console.log('Liked songs for all songs:', likedSongsForAllSongs);
      setLikedSongs(likedSongsForAllSongs);
    } catch (error) {
      console.error('Error fetching liked songs for all songs:', error);
      // Handle error as needed
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
      <Navbar />
      <div className='template-background'>
        <h1 style={{ color: 'white' }}>Favorites Page</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="card-container">
            {likedSongs.map((song, index) => (
              <div key={index} className="card">
                <h2>{song.name}</h2>
                <p>Artist: {song.artist}</p>
                <img src={song.picture} alt={`${song.name} by ${song.artist}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;