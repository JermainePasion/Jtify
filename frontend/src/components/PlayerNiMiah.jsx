import React, { useState, useEffect, useRef } from "react";
import { togglePlayerVisibility } from "../actions/musicPlayerActions";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
} from "react-icons/fa";
import { BiRepeat } from "react-icons/bi";
import Slider from "@mui/material/Slider";

import { useDispatch, useSelector } from "react-redux";
import { listAds } from "../actions/adsActions";

function PlayerNiMiah() {
  const [currentAd, setCurrentAd] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const user = useSelector((state) => state.userDetails.user);
  const isSubscriber =  user?.data?.user_data?.is_subscriber
  const isArtist = user?.data?.user_data?.is_artist
  const isSuperuser = user?.data?.user_data?.is_superuser

  const dispatch = useDispatch();

  const currentlyPlaying = useSelector(
    (state) => state.player.currentlyPlayingSong
  );

  const isPlayerVisible = useSelector((state) => state.player.isVisible);

  const audioPlayerRef = useRef(null);
  const [audio] = useState(new Audio());

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
    if (!isPlayerVisible && audio.paused === false) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isPlayerVisible]);

  const handleAdFinish = () => {
    console.log("Ad finished. Resuming playback...");
    setCurrentAd(null);
    audio.play();
    setIsPlaying(true);
  };

  const loadSong = () => {
    const selectedSong = currentlyPlaying;
    audio.src = selectedSong.file;
    audio.load();
    audio.pause();
    setIsPlaying(true);
    const playAudio = () => {
      audio.play();
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
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    // Implement shuffle logic here
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    // Implement repeat logic here
  };

  const toggleMute = () => {
    const newVolume = isMuted ? 50 : 0;
    setIsMuted(!isMuted);
    setVolume(newVolume);
    audioPlayerRef.current.volume = newVolume / 100;
  };

  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem("volume");
    return storedVolume !== null ? parseInt(storedVolume, 10) : 50;
  });

  const AdsNiMiah = async () => {
    try {
      // const isSubscriber =  (user?.data?.user_data?.is_superuser || user?.data?.user_data?.is_artist) && user?.data?.user_data?.is_subscriber};
      // if (isSubscriber) {
      //   return;
      
      const ads = await dispatch(listAds());
      const adsArray = Array.from(ads);
      const adsIndex = Math.floor(Math.random() * adsArray.length);

      const nextAd = adsArray[adsIndex];
      if (nextAd) {
        try {
          await audio.pause();
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

  // Ensure player visibility remains consistent when selecting a new song
  useEffect(() => {
    if (currentlyPlaying && !isPlayerVisible) {
      dispatch(togglePlayerVisibility(true));
    }
  }, [currentlyPlaying]);

  if (!isPlayerVisible) {
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
                    // fontFamily: selectedFont,
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
              // value={volume}
              // onChange={handleVolumeChange}
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
    </div>
  );
}

export default PlayerNiMiah;
