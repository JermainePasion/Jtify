import { FETCH_SONGS_REQUEST, FETCH_SONGS_SUCCESS, FETCH_SONGS_FAILURE } from '../actions/songActions';

const initialState = {
  songs: [],
  loading: false,
  error: null
};

const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SONGS_REQUEST:
      return { ...state, loading: true };
    case FETCH_SONGS_SUCCESS:
      return { ...state, loading: false, songs: action.payload, error: null };
    case FETCH_SONGS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default songReducer;