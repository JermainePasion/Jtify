// songReducer.jsx

import {
  SONG_LIST_REQUEST,
  SONG_LIST_SUCCESS,
  SONG_LIST_FAILURE
} from '../constants/songConstants'; 

const initialState = {
  songs: [], // Initialize songs state as an empty array
  loading: false,
  error: null
};

const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case SONG_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case SONG_LIST_SUCCESS:
      return { ...state, loading: false, songs: action.payload, error: null };
    case SONG_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default songReducer;
