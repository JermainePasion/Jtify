import axios from 'axios';
import {
  SONG_LIST_REQUEST,
  SONG_LIST_SUCCESS,
  SONG_LIST_FAILURE,
  SONG_LIKE_REQUEST,
  SONG_LIKE_SUCCESS,
  SONG_LIKE_FAILURE,
  SONG_UNLIKE_REQUEST,
  SONG_UNLIKE_SUCCESS,
  SONG_UNLIKE_FAILURE, 
  LIKED_SONGS_REQUEST,
  LIKED_SONGS_SUCCESS,
  LIKED_SONGS_FAILURE
} from '../constants/songConstants'; 

/* const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000'
}); */

export const listSongs = () => async (dispatch) => {
  try {
    dispatch({ type: SONG_LIST_REQUEST })
    const { data } = await axios.get('/api/songs/'); 
    dispatch({ type: SONG_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SONG_LIST_FAILURE, payload: error.message
      && error.response.data.message 
      ? error.response.data.message 
      : error.message });
  }
};

export const likeSong = (songId, userId) => async (dispatch) => {
  try {
    dispatch({ type: SONG_LIKE_REQUEST });
    await axios.post(`/api/songs/${songId}/like/`, { user_id: userId });
    dispatch({ type: SONG_LIKE_SUCCESS });
  } catch (error) {
    dispatch({ 
      type: SONG_LIKE_FAILURE, 
      payload: error.message && error.response.data.message 
        ? error.response.data.message 
        : error.message 
    });
  }
};

export const unlikeSong = (songId, userId) => async (dispatch) => {
  try {
    dispatch({ type: SONG_UNLIKE_REQUEST });
    await axios.post(`/api/songs/${songId}/unlike/`, { user_id: userId });
    dispatch({ type: SONG_UNLIKE_SUCCESS });
  } catch (error) {
    dispatch({ 
      type: SONG_UNLIKE_FAILURE, 
      payload: error.message && error.response.data.message 
        ? error.response.data.message 
        : error.message 
    });
  }


};