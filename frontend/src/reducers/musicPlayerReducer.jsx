export const playerReducer = (state = { isVisible: false, currentlyPlayingSong: null }, action) => {
  switch (action.type) {
    case "SET_CURRENTLY_PLAYING_SONG":
      // Update localStorage when the currently playing song changes
      localStorage.setItem("currentlyPlayingNiMiah", JSON.stringify(action.payload));
      return {
        ...state,
        currentlyPlayingSong: action.payload,
      };
    case "TOGGLE_PLAYER_VISIBILITY":
      // Update localStorage when the player visibility changes
      const newVisibility = !state.isVisible;
      localStorage.setItem("visibilityNiMiah", JSON.stringify(newVisibility));
      return {
        ...state,
        isVisible: newVisibility,
      };
    case "RESET_COUNTER":
      // Reset currentCounter to 0
      localStorage.removeItem('currentCounter');
      return {
        ...state,
        currentCounter: 0,
      };
    case "USER_LOGOUT":
      // Remove visibilityNiMiah from localStorage and set isVisible to false
      localStorage.removeItem("visibilityNiMiah");
      localStorage.removeItem("currentlyPlayingNiMiah");
      return {
        ...state,
        isVisible: false,
        currentlyPlayingSong: null,
      };
    default:
      return state;
  }
}
