import { SONG_LIST_REQUEST, SONG_LIST_SUCCESS, SONG_LIST_FAILURE } from '../constants/songConstants';

/* const initialState = {
  songs: [],
  loading: false,
  error: null
}; */

const songListReducer = (state = { songs: [] }, action) => {
  switch (action.type) {
    case SONG_LIST_REQUEST:
      return { loading: true, songs:[] };
    case SONG_LIST_SUCCESS:
      return { loading: false, songs: action.payload };
    case SONG_LIST_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export default songListReducer;