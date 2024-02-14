import axios from 'axios';
import {
  SONG_LIST_REQUEST,
  SONG_LIST_SUCCESS,
  SONG_LIST_FAILURE,
  SONG_DETAILS_REQUEST,
  SONG_DETAILS_SUCCESS,
  SONG_DETAILS_FAILURE,
  SONG_EDIT_REQUEST,
  SONG_EDIT_SUCCESS,
  SONG_EDIT_FAILURE
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

export const DetailViewSong = (id) => async (dispatch) => {
  try {
    console.log('Dispatching SONG_DETAILS_REQUEST');
    dispatch({ type: SONG_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/songs/${id}`);
    
    console.log('Dispatching SONG_DETAILS_SUCCESS with payload:', data);
    console.log('Song name:', data.name);
    dispatch({ type: SONG_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    console.log('Dispatching SONG_DETAILS_FAILURE');
    dispatch({
      type: SONG_DETAILS_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};


export const EditSong = (id, song) => async (dispatch, getState) => {
  try {
    dispatch({ type: SONG_EDIT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('name', song.name || '');
    formData.append('artist', song.artist || '');

    // Append 'picture' only if it exists
    if (song.picture) {
      formData.append('picture', song.picture, song.picture.name);
    }

    // Append 'file' only if it exists
    if (song.file) {
      formData.append('file', song.file, song.file.name);
    }

    console.log(formData);
    const { data } = await axios.put(`/api/songs/${id}/edit/`, formData, config);

    dispatch({ type: SONG_EDIT_SUCCESS, payload: data });
    dispatch(DetailViewSong(id));  // Assuming you have a DetailViewSong action
  } catch (error) {
    dispatch({
      type: SONG_EDIT_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};