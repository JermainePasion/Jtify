export const setCurrentlyPlayingSong = (song) => {
    localStorage.setItem("currentlyPlayingNiMiah", JSON.stringify(song));
    return {
      type: "SET_CURRENTLY_PLAYING_SONG",
      payload: song,
    };
  };
  
  export const togglePlayerVisibility = (visibility) => {
    localStorage.setItem("visibilityNiMiah", JSON.stringify(visibility));
  
    return {
      type: "TOGGLE_PLAYER_VISIBILITY",
      payload: visibility,
    };
  };
  
  