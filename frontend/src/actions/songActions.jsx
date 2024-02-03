import axios from 'axios';

export const FETCH_SONGS_REQUEST = 'FETCH_SONGS_REQUEST';
export const FETCH_SONGS_SUCCESS = 'FETCH_SONGS_SUCCESS';
export const FETCH_SONGS_FAILURE = 'FETCH_SONGS_FAILURE';

export const fetchSongs = () => {
  return dispatch => {
    dispatch({ type: FETCH_SONGS_REQUEST });

    axios.get('/api/songs/')
      .then(response => dispatch({ type: FETCH_SONGS_SUCCESS, payload: response.data }))
      .catch(error => dispatch({ type: FETCH_SONGS_FAILURE, payload: error }));
  };
};