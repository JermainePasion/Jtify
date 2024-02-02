export const FETCH_SONGS_REQUEST = 'FETCH_SONGS_REQUEST';
export const FETCH_SONGS_SUCCESS = 'FETCH_SONGS_SUCCESS';
export const FETCH_SONGS_FAILURE = 'FETCH_SONGS_FAILURE';

export const fetchSongs = () => {
  return dispatch => {
    dispatch({ type: FETCH_SONGS_REQUEST });

    fetch('/api/songs/')
      .then(response => response.json())
      .then(data => dispatch({ type: FETCH_SONGS_SUCCESS, payload: data }))
      .catch(error => dispatch({ type: FETCH_SONGS_FAILURE, payload: error }));
  };
};