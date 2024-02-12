import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { getUserDetails } from '../../actions/userActions';
import { listSongs } from '../../actions/songActions'; 
import { likeSong } from '../../actions/userActions'; 
import axios from 'axios'; 

function Favorites() {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.userDetails);
  const user = userDetails.user;
  const [userId, setUserId] = useState(null); // State to store the user ID
  const songs = useSelector(state => state.songs); // Select songs from the Redux store
  const [likedSongs, setLikedSongs] = useState([]); // State to store liked songs
  const color = user?.data?.profile_data?.color || '#defaultColor';
  const selectedFont = user?.data?.profile_data?.font || 'defaultFont';

  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(listSongs()); // Fetch the list of songs
  }, [dispatch]);

  useEffect(() => {
    // Once user details are available, set the user ID
    if (user && user.id) {
      setUserId(user.id); // Set the user ID based on the user's ID property
    }
  }, [user]);

  useEffect(() => {
    // Fetch liked songs only when the user ID and songs are available
    const fetchLikedSongs = async () => {
      if (userId && songs.length > 0) {
        try {
          // Fetch liked song IDs for the user
          const response = await axios.get(`/api/user/${userId}/liked-songs/`);
          const likedSongIds = response.data;
  
          // Filter the songs that match the liked song IDs
          const filteredSongs = songs.filter(song => likedSongIds.includes(song.id));
          setLikedSongs(filteredSongs);
        } catch (error) {
          console.error('Error fetching liked songs:', error);
        }
      }
    };

    fetchLikedSongs();
  }, [userId, songs]); 

  useEffect(() => {
    if (user) {
      dispatch(likeSong(user.id)); 
    }
  }, [dispatch, user]);

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: color, fontFamily: selectedFont  }}>
      <Navbar />
      <div className='template-background' style={{ 
        flex: 1, 
        marginLeft: '10px', 
        position: 'relative', 
        overflowX: 'auto', 
        padding: '10px 0',
        backgroundSize: 'cover',
      }}>
        <h1 style={{ color: 'white', fontFamily: selectedFont, paddingLeft: '15px', fontSize: '30px', }}>Favorites Page</h1>
       
        <div>
          <h2 style={{ color: 'white', fontFamily: selectedFont, paddingLeft: '15px', fontSize: '20px' }}>Liked Songs:</h2>
          <ul>
            {likedSongs.map((song, index) => (
              <li key={index}>
                <div>
                  <h3>Song: {song.name}</h3>
                  <p>Artist: {song.artist}</p>
                  <img src={song.picture} alt={song.name} style={{ width: '100px', height: '100px' }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Favorites;

