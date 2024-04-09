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
  const [totalTimePlayed, setTotalTimePlayed] = useState(() => {
    const storedTimePlayed = localStorage.getItem('totalTimePlayed');
    return storedTimePlayed !== null ? parseInt(storedTimePlayed, 10) : 0;
  });
  const user = useSelector((state) => state.userDetails.user);
  const isSubscriber = user?.data?.user_data?.is_subscriber;
  const isArtist = user?.data?.user_data?.is_artist;
  const isSuperuser = user?.data?.user_data?.is_superuser;

  const dispatch = useDispatch();

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
  }); // Assign random number between 0 to 3 for adsCounter

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
    // Stop the music when the player is not visible
    if (!isPlayerVisible && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlayerVisible]);

  useEffect(() => {
    // Set the volume when the audio element is mounted
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      setIsMuted(volume === 0);
    }
  }, [volume]);

  useEffect(() => {
    // Load the song when currentlyPlaying changes
    if (currentlyPlaying) {
      loadSong();
    }
  }, [currentlyPlaying]);

  useEffect(() => {
    // Show the player when a song starts playing
    if (currentlyPlaying && !isPlayerVisible) {
      dispatch(togglePlayerVisibility(true));
    }
  }, [currentlyPlaying]);

  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    // Update the slider value based on the current time of the audio
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


  const songs = []; // Define songs array
  const playSong = (index) => {}; // Define playSong function

  const skipTrack = (forward = true) => {
    let newIndex = currentSongIndex + (forward ? 1 : -1);
    if (newIndex < 0) {
      newIndex = songs.length - 1;
    } else if (newIndex >= songs.length) {
      newIndex = 0;
    }
    setCurrentSongIndex(newIndex);
    playSong(newIndex);
  };
  
  useEffect(() => {
    audioRef.current.addEventListener('ended', handleSongEnd);

    return () => {
      audioRef.current.removeEventListener('ended', handleSongEnd);
    };
  }, [currentlyPlaying, skipTrack]);

  const handleSongEnd = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      skipTrack(true);
    }
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

  if (!user) {
    return null;
  }

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
            style={{ width: "100%", maxHeight: "150px", borderRadius: "4px" }}
          />
          <audio
            key={currentAd.audio}
            controls
            autoPlay
            className="ad-audio"
            onEnded={handleAdFinish}
          >
            <source src={currentAd.audio} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
          <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "5px" }}>
            Ad Progress:{" "}
            {/* {(
              (audio.current.currentTime /
                audio.current.duration) *
              100
            ).toFixed(2)} */}
            %
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
                  width: "64px",
                  height: "64px",
                  marginRight: "20px",
                  borderRadius: "4px",
                }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "16px",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentlyPlaying.name}
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "#b3b3b3" }}>
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
                border: "none",
                fontSize: "24px",
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
              onClick={handleBackward}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "24px",
                color: "#fff",
              }}
            >
              <FaStepBackward />
            </button>
            <button
              onClick={togglePlayPause}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "32px",
                color: "#fff",
              }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={handleForward}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "24px",
                color: "#fff",
              }}
            >
              <FaStepForward />
            </button>
            <button
              onClick={toggleShuffle}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "24px",
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
                backgroundColor: "transparent",
                border: "none",
                fontSize: "20px",
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
                color: "#fff",
                width: "100px",
                "& .MuiSlider-thumb": { width: 20, height: 20 },
              }}
            />
          </div>
        </div>
      )}
      {audioRef.current && audioRef.current.duration > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            cursor: 'pointer',
            margin: 'auto',
          }}
        >
          <Slider
            value={sliderValue}
            onChange={handleTimeBarChange}
            aria-labelledby="continuous-slider"
            style={{ color: '#fff', width: '100%' }}
          />
          <div
            style={{
              color: '#b3b3b3',
              fontSize: '14px',
              textAlign: 'left',
              position: 'absolute',
              left: '0',
              top: '-20px',
            }}
          >
            {formatTime(audioRef.current.currentTime)}
          </div>
          <div
            style={{
              color: '#b3b3b3',
              fontSize: '14px',
              textAlign: 'right',
              position: 'absolute',
              right: '0',
              top: '-20px',
            }}
          >
            {formatTime(audioRef.current.duration)}
          </div>
        </div>
      )}
    </div>
  );
}
export default PlayerNiMiah;
