import { SONG_LIST_REQUEST, SONG_LIST_SUCCESS, SONG_LIST_FAILURE,
  SONG_LIKE_REQUEST, SONG_LIKE_SUCCESS, SONG_LIKE_FAILURE,
  SONG_UNLIKE_REQUEST, SONG_UNLIKE_SUCCESS,SONG_UNLIKE_FAILURE } from '../constants/songConstants';

/* const initialState = {
  songs: [],
  loading: false,
  error: null
}; */

const songListReducer = (state = { songs: [] }, action) => {
  switch (action.type) {
    case SONG_LIST_REQUEST:
    case SONG_LIKE_REQUEST:
    case SONG_UNLIKE_REQUEST:
      return { ...state, loading: true };
    case SONG_LIST_SUCCESS:
      return { ...state, loading: false, songs: action.payload };
    case SONG_LIKE_SUCCESS:
    case SONG_UNLIKE_SUCCESS:
      return { ...state, loading: false };
    case SONG_LIST_FAILURE:
    case SONG_LIKE_FAILURE:
    case SONG_UNLIKE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default songListReducer;