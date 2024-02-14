// songReducer.jsx
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
// songReducer.jsx


const initialState = {
  songs: [], // Assuming this is for a list of songs
  loading: false,
  error: null,
  song: {}, // This property holds the details of a single song
};

const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case SONG_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case SONG_LIST_SUCCESS:
      return { ...state, loading: false, songs: action.payload, error: null };
    case SONG_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload, songs: [] };
    case SONG_DETAILS_REQUEST:
      return { ...state, loading: true, error: null, song: {} };
    case SONG_DETAILS_SUCCESS:
      console.log('Reducer received payload:', action.payload);
      return { ...state, loading: false, song: action.payload, error: null };
    case SONG_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload, song: {} };
    default:
      return state;
  }
};

export default songReducer;





// songReducer.jsx
export const DetailViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SONG_DETAILS_REQUEST:
      return { ...state, loading: true, error: null, song: null }; // Set song to null initially
    case SONG_DETAILS_SUCCESS:
      console.log('Reducer received payload:', action.payload);
      const updatedState = { ...state, loading: false, song: action.payload, error: null };
      console.log('Updated state:', updatedState);
      return updatedState;
    case SONG_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload, song: null };
    default:
      return state;
  }
};

export const songEditReducer = (state = {}, action) => {
  switch (action.type) {
    case SONG_EDIT_REQUEST:
      return { loading: true };
    case SONG_EDIT_SUCCESS:
      return { loading: false, success: true, song: action.payload };
    case SONG_EDIT_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
