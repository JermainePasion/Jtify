import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar";
import { listSongs, searchSongs } from "../../actions/songActions";
import Song from "../Song";
import MusicPlayer from "../MusicPlayer";
import { getUserDetails } from "../../actions/userActions";
import { BsSearch } from "react-icons/bs";
import { playlistView } from "../../actions/songActions";
import Playlist from "../Playlist"; // Import Playlist component
import { setCurrentlyPlayingSong, togglePlayerVisibility } from "../../actions/musicPlayerActions";
import { likedSongList } from "../../actions/songActions"; 
import { updatePlayCount } from "../../actions/songActions";
import { FaStepForward, FaStepBackward } from "react-icons/fa";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Home() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const { loading, error, songs, playlists } = useSelector(
    (state) => state.songList
  );
  const { likedSongs } = useSelector(
    (state) => state.likedSongList // Access likedSongs from the state
  );

  
  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || "#defaultColor";
  const selectedFont = user?.data?.profile_data?.font || "defaultFont";
  const [showNavbar, setShowNavbar] = useState(true);
  const uniqueSongNames = new Set();
const uniqueLikedSongs = likedSongs.filter(song => {
  if (uniqueSongNames.has(song.name)) {
    return false; // If the song name is already in the set, filter it out
  }
  uniqueSongNames.add(song.name); // Otherwise, add the song name to the set and keep the song
  return true;
});

  const [query, setQuery] = useState("");

  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const playSong = async (index) => {
    const song = uniqueLikedSongs[index];
    try {
      await dispatch(updatePlayCount(song.id, user.data.user_data.id));
    } catch (error) {
      console.error('Error updating play count:', error);
    }
    setCurrentlyPlaying(index);
    dispatch(setCurrentlyPlayingSong(song));
    dispatch(togglePlayerVisibility());
  };

  


  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(listSongs());
    dispatch(likedSongList());
    dispatch(playlistView());
  }, [dispatch]);

  const playPreviousSong = () => {
    let previousIndex = currentlyPlaying - 1;
    if (previousIndex < 0) {
      previousIndex = uniqueLikedSongs.length - 1;
    }
    playSong(previousIndex);
  };

  const playNextSong = () => {
    let nextIndex = currentlyPlaying + 1;
    if (nextIndex >= uniqueLikedSongs.length) {
      nextIndex = 0;
    }
    playSong(nextIndex);
  };

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        minHeight: "120vh",
        backgroundColor: color,
        fontFamily: selectedFont,
        overflowx: "auto",
      }}
    >
     {showNavbar && <Navbar />}
     
     <div className='template-background' style={{ 
        flex: 1, 
        position: 'relative', 
        padding: '10px', // Adjust padding for better spacing
        backgroundSize: 'cover', // Use 'cover' to fill the container
        backgroundPosition: 'center', // Center the background image
        overflow: 'auto' // Add overflow for content that exceeds the container
      }}>
        <div style={{ position: "absolute", top: "10px", right: "30px" }}>
  <div
    style={{
      position: "relative",
      display: "flex",
      
    }}
  >
            <div className="input-group rounded">
              <input
                type="search"
                className="form-control rounded pl-5"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-addon"
                value={query}
                onChange={handleSearchChange}
                style={{
                  position: "relative",
                  transition: "width 0.3s ease-in-out",
                  width: "300px",
                  paddingLeft: "30px",
                }}
                onFocus={(e) => (e.target.style.width = "600px")}
                onBlur={(e) => (e.target.style.width = "300px")}
              />
              
            </div>
          </div>
        </div>
        <h1
          style={{ color: "white", fontFamily: selectedFont, fontSize: "30px" }}
        >
          Trending Songs
        </h1>
        <div
    style={{
      display: "flex",
      flexDirection: "row",
      padding: "10px 0",
      overflowX: "hidden",
      transition: "overflow-x 0.5s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.overflowX = "auto";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.overflowX = "hidden";
    }}
  >
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>Error: {error}</div>
    ) : (
      <>
              {uniqueLikedSongs
                .filter(song => song.name.toLowerCase().includes(query.toLowerCase())) // Filter songs based on search query
                .slice(0, 10) // Limit to 10 songs
                .map((song, index) => (
                  <Song
                    key={song.id}
                    song={song}
                    playSong={() => playSong(index)}
                    isPlaying={currentlyPlaying === index}
                    selectedFont={selectedFont}
                  />
                ))
              }
            </>
          )}
        </div>
        

        <h2
          style={{ color: "white", fontFamily: selectedFont, fontSize: "30px" }}
        >
          Playlists
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "10px 0",
            overflowX: "hidden",
            transition: "overflow-x 0.5s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.overflowX = "auto";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.overflowX = "hidden";
          }}
        >
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            // Filter playlists based on the search query and then map
            playlists
              .filter((playlist) =>
                playlist.name.toLowerCase().includes(query.toLowerCase())
              )
              .map((playlist) => (
                <Playlist key={playlist.id} playlist={playlist} />
              ))
          )}
        </div>
        <div style={{ position: 'absolute', top: '10px', left: '5px' }}>
            <FontAwesomeIcon
              icon={faBars}
              style={{
                cursor: 'pointer',
                color: '#fff',
                fontSize: '20px',
                transform: showNavbar ? 'rotate(0deg)' : 'rotate(90deg)',
                transition: 'transform 0.3s ease',
              }}
              onClick={toggleNavbar}
            />
          </div>
          
      </div>
    </div>
  );
}

export default Home;