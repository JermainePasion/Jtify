import {
  SONG_LIST_REQUEST,
  SONG_LIST_SUCCESS,
  SONG_LIST_FAILURE,
  SONG_DETAILS_REQUEST,
  SONG_DETAILS_SUCCESS,
  SONG_DETAILS_FAILURE,
  SONG_EDIT_REQUEST,
  SONG_EDIT_SUCCESS,
  SONG_EDIT_FAILURE,
  SONG_DELETE_REQUEST,
  SONG_DELETE_SUCCESS,
  SONG_DELETE_FAILURE,
  LIKE_SONG_REQUEST,
  LIKE_SONG_SUCCESS,
  LIKE_SONG_FAILURE,
  FETCH_LIKED_SONGS_REQUEST,
  FETCH_LIKED_SONGS_SUCCESS,
  FETCH_LIKED_SONGS_FAILURE,
  UNLIKE_SONG_REQUEST,
  UNLIKE_SONG_SUCCESS,
  UNLIKE_SONG_FAILURE,
  FETCH_SONGS_BY_GENRE_REQUEST,
  FETCH_SONGS_BY_GENRE_SUCCESS,
  FETCH_SONGS_BY_GENRE_FAILURE,
  SONG_SEARCH_REQUEST,
  SONG_SEARCH_SUCCESS,
  SONG_SEARCH_FAILURE,
  PLAYLIST_LIST_REQUEST,

  PLAYLIST_LIST_SUCCESS,
  PLAYLIST_LIST_FAILURE,
  PLAYLIST_DETAILS_REQUEST,
  PLAYLIST_DETAILS_SUCCESS,
  PLAYLIST_DETAILS_FAILURE,
  ADD_PLAYLIST_REQUEST,
  ADD_PLAYLIST_SUCCESS,
  ADD_PLAYLIST_FAILURE,
  MY_SONGS_REQUEST,
  MY_SONGS_SUCCESS,
  MY_SONGS_FAILURE,
  MY_PLAYLISTS_REQUEST,
  MY_PLAYLISTS_SUCCESS,
  MY_PLAYLISTS_FAILURE,
  UPLOAD_SONG_TO_PLAYLIST_REQUEST,
  UPLOAD_SONG_TO_PLAYLIST_SUCCESS,
  UPLOAD_SONG_TO_PLAYLIST_FAILURE,

} from '../constants/songConstants';
// songReducer.jsx



const initialState = {
  songs: [],
  genreSongs: [],
  playlists: [],
  loading: false,
  error: null,
  song: null,
  playlist: null,
};

const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case SONG_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case SONG_LIST_SUCCESS:
      return { ...state, loading: false, songs: action.payload, error: null };
    case SONG_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload, songs: [] };
    case SONG_DETAILS_SUCCESS:
      return { ...state, loading: false, song: action.payload, error: null };
    case PLAYLIST_LIST_SUCCESS:
        console.log('Payload:', action.payload); // Add this line
        return {
          ...state,
          loading: false,
          playlists: action.payload.map(playlist => ({
            ...playlist,
            songs: Array.isArray(playlist.songs) ? playlist.songs : [playlist.songs],
            numberOfSongs: playlist.songs.length,
          })),
          error: null,
        };
    case PLAYLIST_DETAILS_SUCCESS:
      return { ...state, loading: false, playlist: action.payload, error: null };
    case MY_SONGS_SUCCESS:
      console.log('My Songs Success Payload:', action.payload);
      return { ...state, loading: false, songs: action.payload, error: null };
    case MY_PLAYLISTS_SUCCESS:
        return { ...state, loading: false, playlists: action.payload, error: null };
      case FETCH_SONGS_BY_GENRE_SUCCESS:
        return {
          ...state,
          loading: false,
          genreSongs: action.payload,
          error: null,
        };
    default:
      return state;
  }
};
export default songReducer;






// songReducer.jsx
export const DetailViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SONG_DETAILS_REQUEST:
      return { ...state, loading: true, error: null, song: null };
    case SONG_DETAILS_SUCCESS:
      return { ...state, loading: false, song: action.payload, error: null };
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

export const songDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SONG_DELETE_REQUEST:
      return { loading: true };
    case SONG_DELETE_SUCCESS:
      return { loading: false, success: true };
    case SONG_DELETE_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const likeSongReducer = (state = {}, action) => {
  switch (action.type) {
    case LIKE_SONG_REQUEST:
      return { loading: true };
    case LIKE_SONG_SUCCESS:
      return { loading: false, success: true };
    case LIKE_SONG_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const fetchLikedSongsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LIKED_SONGS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_LIKED_SONGS_SUCCESS:
      return { ...state, loading: false, songs: action.payload, error: null };
    case FETCH_LIKED_SONGS_FAILURE:
      return { ...state, loading: false, error: action.payload, songs: [] };
    default:
      return state;
  }
};

export const unlikeSongReducer = (state = {}, action) => {
  switch (action.type) {
    case UNLIKE_SONG_REQUEST:
      return { loading: true };
    case UNLIKE_SONG_SUCCESS:
      return { loading: false, success: true };
    case UNLIKE_SONG_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const songGenreReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SONGS_BY_GENRE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      case FETCH_SONGS_BY_GENRE_SUCCESS:
        return {
          ...state,
          loading: false,
          genreSongs: action.payload,
          error: null,
        };
    case FETCH_SONGS_BY_GENRE_FAILURE:
      console.log('Error in FETCH_SONGS_BY_GENRE_FAILURE:', action.payload); // Add this line to log any errors
      return {
        ...state,
        loading: false,
        error: action.payload,
        genreSongs: [],
      };
    default:
      return state;
  }
};

export const songSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SONG_SEARCH_REQUEST:
      return { ...state, loading: true, error: null };
    case SONG_SEARCH_SUCCESS:
      return { ...state, loading: false, songs: action.payload, error: null }; // Update songs state with the search results
    case SONG_SEARCH_FAILURE:
      return { ...state, loading: false, error: action.payload, songs: [] };
    default:
      return state;
  }
};

export const playlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYLIST_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case PLAYLIST_LIST_SUCCESS:
      return { ...state, loading: false, playlists: action.payload, error: null }; // Make sure playlists is updated correctly
    case PLAYLIST_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload, playlists: [] };
    default:
      return state;
  }
};

export const playlistDetailViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYLIST_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case PLAYLIST_DETAILS_SUCCESS:
      return { ...state, loading: false, playlist: action.payload, error: null };
    case PLAYLIST_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload, playlist: null };
    default:
      return state;
  }
}

export const addPlaylistReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_PLAYLIST_REQUEST:
      return { loading: true };
    case ADD_PLAYLIST_SUCCESS:
      return { loading: false, success: true, playlist: action.payload };
    case ADD_PLAYLIST_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const mySongsReducer = (state = initialState, action) => {
  switch (action.type) {
    case MY_SONGS_REQUEST:
      return { ...state, loading: true, error: null };
    case MY_SONGS_SUCCESS:
      console.log('My Songs Success Payload:', action.payload);
      return { ...state, loading: false, songs: action.payload, error: null };
      
    case MY_SONGS_FAILURE:
      console.error('My Songs Failure Error:', action.payload);
      return { ...state, loading: false, error: action.payload, songs: [] };
    default:
      return state;
  }
};

export const myPlaylistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case MY_PLAYLISTS_REQUEST:
      return { ...state, loading: true, error: null };
    case MY_PLAYLISTS_SUCCESS:
      return { ...state, loading: false, playlists: action.payload, error: null };
    case MY_PLAYLISTS_FAILURE:
      return { ...state, loading: false, error: action.payload, playlists: [] };
    default:
      return state;
  }
}

export const uploadSongToPlaylistReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_SONG_TO_PLAYLIST_REQUEST:
      return { loading: true };
    case UPLOAD_SONG_TO_PLAYLIST_SUCCESS:
      return { loading: false, success: true };
    case UPLOAD_SONG_TO_PLAYLIST_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
