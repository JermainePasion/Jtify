import axios from 'axios';
import {
  SONG_LIST_REQUEST,
  SONG_LIST_SUCCESS,
  SONG_LIST_FAILURE
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