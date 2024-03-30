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
import { setCurrentlyPlayingSong, togglePlayerVisibility } from "../../actions/musicPlayerActions"; // Import setCurrentlyPlayingSong and togglePlayerVisibility from musicPlayerActions";



function Home() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const { loading, error, songs, playlists } = useSelector(
    (state) => state.songList
  );

  const user = useSelector((state) => state.userDetails.user);
  const color = user?.data?.profile_data?.color || "#defaultColor";
  const selectedFont = user?.data?.profile_data?.font || "defaultFont";

  const [query, setQuery] = useState("");

  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const playSong = (song) => {

    setCurrentlyPlaying(song);
    dispatch(setCurrentlyPlayingSong(song));
    dispatch(togglePlayerVisibility());
    // if (currentlyPlaying === song && !audioRef.current.paused) {
    //   pauseSong();
    // } else {
    //   if (currentlyPlaying !== song) {
    //     audioRef.current.src = song.file;
    //     setCurrentTime(0);
    //     setCurrentlyPlaying(song);
    //     setIsPlaying(true);
    //     localStorage.setItem('currentlyPlaying', JSON.stringify(song));
    //   } else {
    //     audioRef.current.currentTime = currentTime;
    //   }
    //   audioRef.current.play();
    // }
  };


  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(listSongs());
    dispatch(playlistView());
  }, [dispatch]);
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: color,
        fontFamily: selectedFont,
      }}
    >
      <Navbar />
      <div
        className="template-background"
        style={{
          flex: 1,
          marginLeft: "10px",
          position: "relative",
          overflowX: "auto",
          padding: "10px 20px", // Increase padding for better spacing
          backgroundSize: "cover",
        }}
      >
        <div style={{ position: "absolute", top: "10px", right: "30px" }}>
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "30px",
              display: "flex",
              alignItems: "center",
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
              <div className="input-group-append">
                <span className="input-group-text border-0" id="search-addon">
                  <BsSearch
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-search"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      position: "absolute",
                      left: "5px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <h1
          style={{ color: "white", fontFamily: selectedFont, fontSize: "30px" }}
        >
          Today's hits
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
            // Filter songs based on the search query and then map
            songs
              .filter(
                (song) =>
                  song.name.toLowerCase().includes(query.toLowerCase()) ||
                  song.artist.toLowerCase().includes(query.toLowerCase())
              )
              .map((song) => (
                <Song
                  key={song.id}
                  song={song}
                  playSong={playSong}
                  isPlaying={currentlyPlaying === song}
                  selectedFont={selectedFont}
                />
              ))
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
      </div>
    </div>
  );
}

export default Home;