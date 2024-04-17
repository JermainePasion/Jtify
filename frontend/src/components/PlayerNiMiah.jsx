import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaRandom } from "react-icons/fa";
import { BiRepeat } from "react-icons/bi";
import Slider from "@mui/material/Slider";

import { useDispatch, useSelector } from "react-redux";
import { listAds } from "../actions/adsActions";
import { setCurrentlyPlayingSong, togglePlayerVisibility } from "../actions/musicPlayerActions";


function PlayerNiMiah() {
  const [currentAd, setCurrentAd] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [tracks, setTracks] = useState([]); 
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [totalTimePlayed, setTotalTimePlayed] = useState(() => {
    const storedTimePlayed = localStorage.getItem('totalTimePlayed');
    return storedTimePlayed !== null ? parseInt(storedTimePlayed, 10) : 0;
  });
  const user = useSelector((state) => state.userDetails.user);
  const isSubscriber = user?.data?.user_data?.is_subscriber;
  const isArtist = user?.data?.user_data?.is_artist;
  const isSuperuser = user?.data?.user_data?.is_superuser;
  const uniqueLikedSongs = []; // Define uniqueLikedSongs array
  const currentlyPlayingNiMiah = useSelector(
    (state) => state.player.currentlyPlaying
  )
  const playlist = useSelector((state) => state.playlistView);
  const { playlists } = playlist;
  const songList = useSelector((state) => state.songList);
  const { songs } = songList;

  const dispatch = useDispatch();
  const isMobileResolution = window.innerWidth <= 768

  const currentlyPlaying = useSelector(
    (state) => state.player.currentlyPlayingSong
  );

  const isPlayerVisible = useSelector((state) => state.player.isVisible);

  const audioPlayerRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem("volume");
    return storedVolume !== null ? parseInt(storedVolume, 10) : 50;
  });

  const [adsCounter, setAdsCounter] = useState(() => {
    const storedAdsCounter = localStorage.getItem("adsCounter");
    return storedAdsCounter !== null
      ? parseInt(storedAdsCounter, 10)
      : Math.floor(Math.random() * 4);
  });

  useEffect(() => {
    localStorage.setItem("adsCounter", adsCounter);
  }, [adsCounter]);

  const [currentCounter, setCurrentCounter] = useState(() => {
    const storedCurrentCounter = localStorage.getItem("currentCounter");
    return storedCurrentCounter !== null
      ? parseInt(storedCurrentCounter, 10)
      : 0;
  });

  useEffect(() => {
    localStorage.setItem("currentCounter", currentCounter.toString());
  }, [currentCounter]);

  useEffect(() => {
    if (currentlyPlaying) {
      if (!isSubscriber && !isArtist && !isSuperuser) {
        if (currentCounter === adsCounter) {
          console.log("Ads Playing");
          AdsNiMiah();
          console.log("ads na mag play 2", currentAd);
          setAdsCounter(Math.floor(Math.random() * 4));
          setCurrentCounter((prevCounter) => {
            let newCounter = prevCounter + 1;
            if (newCounter > 6) {
              newCounter = 0;
            }
            return newCounter;
          });
        } else {
          loadSong();
          setIsPlaying(false);
        }
      } else {
        loadSong();
        setIsPlaying(false);
      }
    }
  }, [currentlyPlaying, adsCounter]);

  useEffect(() => {
    if (!isPlayerVisible && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlayerVisible]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      setIsMuted(volume === 0);
    }
  }, [volume]);

  useEffect(() => {
    if (currentlyPlaying) {
      loadSong();
    }
  }, [currentlyPlaying]);

  useEffect(() => {
    if (currentlyPlaying && !isPlayerVisible) {
      dispatch(togglePlayerVisibility(true));
    }
  }, [currentlyPlaying]);

  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        const progress = (currentTime / duration) * 100;
        setSliderValue(progress);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [currentlyPlaying, sliderValue]);

  const visibilityNiMiah = useSelector((state) => state.player.isVisible);
  useEffect(() => {
    if (!visibilityNiMiah) {
      return; // If visibilityNiMiah is falsy, exit early
    }
  
    console.log("Current track index:", currentTrackIndex);
    console.log("Current track:", tracks[currentTrackIndex]);
    console.log("Track length", tracks.length);
    // If the current track is the last in the playlist or the first and there are playlists available
    if ((currentTrackIndex === tracks.length - 1 || currentTrackIndex === 0) && playlists) {
      console.log("Current track is the last in the playlist or the first");
      const playlistsWithSongs = playlists.filter(playlist => playlist.songs.length > 0);
      if (playlistsWithSongs.length === 0) {
        console.log("No playlists with songs available");
        // Handle the case when there are no playlists with songs
        return;
      }
      const currentPlaylistIndex = playlistsWithSongs.findIndex(playlist => playlist.songs.some(song => song.id === (currentlyPlaying ? currentlyPlaying.id : null)));
      console.log("error", currentPlaylistIndex);
      console.log("Current playlist index:", currentPlaylistIndex);
      if (currentPlaylistIndex !== -1 && currentPlaylistIndex < playlistsWithSongs.length - 1) {
        console.log("Switching to the next playlist");
        const nextPlaylistIndex = currentPlaylistIndex + Math.floor(Math.random() * (playlistsWithSongs.length - currentPlaylistIndex));
        const nextPlaylist = playlistsWithSongs[nextPlaylistIndex];
        console.log("Next playlist:", nextPlaylist);
        setTracks(nextPlaylist.songs);
        setCurrentTrackIndex(0); // Start playing from the first song of the next playlist
      } else {
        console.log("Reverting to the original songs list");
        setTracks(songs); // Revert to the original songs list
        setCurrentTrackIndex(songs.findIndex(song => song.id === currentlyPlaying.id));
      }
    }
  }, [currentTrackIndex, tracks, currentlyPlaying, playlists, songs, visibilityNiMiah]);
  const playSong = (index) => {
    dispatch(setCurrentlyPlayingSong());
   }; // Define playSong function

  const skipTrack = (forward = true, songList) => {
    let newIndex = currentSongIndex + (forward ? 1 : -1);
    if (newIndex < 0) {
      newIndex = songList.length - 1;
    } else if (newIndex >= songList.length) {
      newIndex = 0;
    }
    setCurrentSongIndex(newIndex);
    setCurrentlyPlayingSong(newIndex);
  };



  const handleAdFinish = () => {
    console.log("Ad finished. Resuming playback...");
    setCurrentAd(null);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const loadSong = () => {
    const selectedSong = currentlyPlaying;
    audioRef.current.src = selectedSong.file;
    audioRef.current.load();
    audioRef.current.pause();
    setIsPlaying(true);

    const playAudio = () => {
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentCounter((prevCounter) => {
        let newCounter = prevCounter + 1;
        if (newCounter > 6) {
          newCounter = 0;
        }
        return newCounter;
      });
      document.removeEventListener("click", playAudio);
    };
    document.addEventListener("click", playAudio);
  };

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    // Implement shuffle logic here
  };

  const toggleRepeat = () => {
    if (!isRepeat) {
      setIsRepeat(true);
      setIsShuffle(false);
    } else if (isRepeat && !isShuffle) {
      setIsRepeat(false);
    } else {
      setIsRepeat(false);
    }
  };

  const toggleMute = () => {
    const newVolume = isMuted ? 50 : 0;
    setIsMuted(!isMuted);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100;
      setIsMuted(newValue === 0);
    }
  };

  const AdsNiMiah = async () => {
    try {
      const ads = await dispatch(listAds());
      const adsArray = Array.from(ads);
      const adsIndex = Math.floor(Math.random() * adsArray.length);

      const nextAd = adsArray[adsIndex];
      if (nextAd) {
        try {
          await audioRef.current.pause();
          setCurrentAd(nextAd);
        } catch (error) {
          console.error("Error playing ad:", error);
        }
      } else {
        console.log("No audio ads available");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const handleBackward = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      skipTrack(false);
    }
  };

  const handleForward = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      skipTrack(true);
    }
  };


  const playPreviousSong= () => {
    const prevIndex = currentTrackIndex - 1;
    if (prevIndex >= 0) {
      setCurrentTrackIndex(prevIndex);
      dispatch(setCurrentlyPlayingSong(tracks[prevIndex]));
      loadSong(tracks[prevIndex]);
    }
  };
  
  const playNextSong = () => {
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex < tracks.length) {
      setCurrentTrackIndex(nextIndex);
      dispatch(setCurrentlyPlayingSong(tracks[nextIndex]));
      loadSong(tracks[nextIndex]);
    }
  };


  const handleTimeBarChange = (event, newValue) => {
    // Check if the slider change is due to user interaction
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      const newTime = (newValue / 100) * audioRef.current.duration;
      // Update the audio player's current time
      audioRef.current.currentTime = newTime;
      // Update the slider value to reflect the change
      setSliderValue(newValue);
    }
  };


  const formatTime = (time) => {
    // Implement time formatting logic here
    // Example: Convert time in seconds to 'mm:ss' format
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const visibility = localStorage.getItem('visibilityNiMiah');

  

  if (!user || !visibility || visibility === "false") {
    return null;
  }
  else{
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#282828",
          color: "#fff",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {currentAd && currentAd.audio ? (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <img
              src={currentAd.image}
              alt="img"
              style={{ width: "10%", maxHeight: "150px", borderRadius: "4px" }}
            />
            <audio
  key={currentAd.audio}
  controls
  autoPlay
  className="ad-audio"
  onEnded={handleAdFinish}
  style={{ display: 'none' }}
>
  <source src={currentAd.audio} type="audio/mp3" />
  Your browser does not support the audio tag.
</audio>
            <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "5px" }}>
              Advertisement{" "}
              {/* {(
                (audio.current.currentTime /
                  audio.current.duration) *
                100
              ).toFixed(2)} */}
              
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px",
              borderTop: "1px solid #535353",
            }}
          >
            {currentlyPlaying && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={currentlyPlaying.picture}
              alt="Album Art"
              style={{
                width: "10vw", // Adjusted to be 10% of the viewport width
                height: "10vw", // Adjusted to maintain aspect ratio
                maxWidth: "64px", // Maximum width of 64px
                maxHeight: "64px", // Maximum height of 64px
                marginRight: "20px",
                borderRadius: "4px",
              }}
            />
            <div>
              <p
                style={{
                  margin: 0,
                  marginLeft: "-10px",
                  fontWeight: "bold",
                  fontSize: "2vw", // Adjusted to be 2% of the viewport width
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentlyPlaying.name}
              </p>
              <p
                style={{
                  margin: 0,
                  marginLeft: "-10px",
                  fontSize: "1.2vw", // Adjusted to be 1.2% of the viewport width
                  color: "#b3b3b3",
                }}
              >
                {currentlyPlaying.artist}
              </p>
            </div>
          </div>
        )}
            <div
              style={{
                position: "fixed",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                onClick={toggleRepeat}
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "20px",
                  border: "none",
                  fontSize: "max(2vw, 18px)", // Adjust the font size to be 2% of the viewport width or 18px (whichever is larger)
                  color: "#fff",
                }}
              >
                {isRepeat ? (
                  <BiRepeat style={{ color: "#8a63d2" }} />
                ) : (
                  <BiRepeat style={{ color: "#fff" }} />
                )}
              </button>
              <button
                onClick={playPreviousSong}
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "20px",
                  border: "none",
                  fontSize: "max(2vw, 18px)", // Adjust the font size to be 2% of the viewport width or 18px (whichever is larger)
                  color: "#fff",
                }}
              >
                <FaStepBackward />
              </button>
              <button
                onClick={togglePlayPause}
                style={{
                  marginBottom: "35px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "max(2vw, 18px)",
                  color: "#fff",
                  zIndex: '10'
                }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              {/* <button
                style={{
                  opacity: "0",
                  marginBottom: "20px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "max(2vw, 18px)",
                  color: "#fff",
                }}
              >
                <FaStepForward /> */}
              {/* </button> */}
              <button
                onClick={playNextSong}
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "20px",
                  border: "none",
                  fontSize: "max(2vw, 18px)", // Adjust the font size to be 2% of the viewport width or 18px (whichever is larger)
                  color: "#fff",
                }}
              >
                <FaStepForward style={{ color: "#fff" }}/>
              </button>
              <button
                onClick={toggleShuffle}
                style={{
                  marginBottom: "20px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "max(2vw, 18px)",
                  color: "#fff",
                }}
              >
                <FaRandom style={{ color: isShuffle ? "#8a63d2" : "#fff" }} />
              </button>
              
            
          
            </div>
            <div
              style={{
                position: "fixed",
                right: "20px",
                bottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                onClick={toggleMute}
                style={{
                  marginBottom: "5px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "max(2vw, 18px)",
                  color: "#fff",
                }}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                aria-labelledby="continuous-slider"
                style={{
                  marginBottom: "5px",
                  color: "#fff",
                  width: "max(5vw, 60px)", // Adjusted to be 5% of the viewport width or 60px (whichever is larger)
                  "& .MuiSlider-thumb": { width: "max(1.5vw, 15px)", height: "max(1.5vw, 15px)" }, // Adjusted to be 1.5% of the viewport width or 15px (whichever is larger)
                }}
              />
            </div>
          </div>
        )}
        {audioRef.current && audioRef.current.duration > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '0px', // Adjusted bottom position
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'max(30%, 200px)', // Adjusted to be 30% of the viewport width or 200px (whichever is larger)
              cursor: 'pointer',
              // Adjusted margin to bring it closer to the slider
            }}
          >
            <Slider
              value={sliderValue}
              onChange={handleTimeBarChange}
              aria-labelledby="continuous-slider"
              className="slider-container"
              style={{
                color: '#fff',
                width: '100%',
                height: '0.2rem', // Adjusted height for more precise control
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'max(0.8vw, 10px)', // Adjusted to be 0.8% of the viewport width or 10px (whichever is larger)
                marginTop: '0.4rem', // Adjusted margin to bring it closer to the slider
              }}
            >
              <span>{formatTime(audioRef.current.currentTime)}</span>
              <span>{formatTime(audioRef.current.duration)}</span>
            </div>
            
          </div>
        )}
      </div>
    );
  }
  }

  export default PlayerNiMiah;