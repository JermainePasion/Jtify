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
  SONG_EDIT_FAILURE,
  SONG_ADD_REQUEST,
  SONG_ADD_SUCCESS,
  SONG_ADD_FAILURE,
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
} from '../constants/songConstants'; 

 const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});

export const listSongs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SONG_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
  
    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const { data } = await instance.get('/api/songs/', config);
    dispatch({ type: SONG_LIST_SUCCESS, payload: data });

  } catch (error) {
    dispatch({ type: SONG_LIST_FAILURE, payload: error.message });
  }
};





export const DetailViewSong = (id) => async (dispatch, getState) => {
  try {
    console.log('Dispatching SONG_DETAILS_REQUEST');
    dispatch({ type: SONG_DETAILS_REQUEST });
   
    const {
      userLogin: { userInfo },
    } = getState();
  
    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const { data } = await axios.get(`/api/songs/${id}`, config);
    
    console.log('Dispatching SONG_DETAILS_SUCCESS with payload:', data);
    console.log('Song name:', data.name);
    console.log('Song artist:', data.artist);
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
    formData.append('genre', song.genre || '');

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

export const AddSong = (song) => async (dispatch, getState) => {
  try {
    dispatch({ type: SONG_ADD_REQUEST });

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

    const { data } = await axios.post('/api/songs/upload/', song, config);

    dispatch({ type: SONG_ADD_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in handleSongUpload:", error);
    dispatch({
      type: SONG_ADD_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const DeleteSong = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SONG_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const { data } = await axios.delete(`/api/songs/${id}/delete/`, config);

    dispatch({ type: SONG_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SONG_DELETE_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};


export const likeSong = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: LIKE_SONG_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    // Make a POST request to like the song
    await instance.post(`/api/songs/${id}/like/`, {}, config); // Send an empty object as the request body

    dispatch({ type: LIKE_SONG_SUCCESS });
  } catch (error) {
    dispatch({
      type: LIKE_SONG_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};


export const fetchLikedSongs = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_LIKED_SONGS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    // Use the userId variable to construct the URL
    const response = await instance.get(`/api/songs/liked/${id}/`, config);
    const likedSongs = response.data;

    // Extract song IDs from liked songs
    const songIds = likedSongs.map((likedSong) => likedSong.song);

    // Fetch details of each song from the general songs list
    const songDetails = await Promise.all(
      songIds.map(async (songId) => {
        const songResponse = await instance.get(`/api/songs/${songId}/`, config);
        return songResponse.data;
      })
    );

    dispatch({ type: FETCH_LIKED_SONGS_SUCCESS, payload: songDetails });
  } catch (error) {
    dispatch({ type: FETCH_LIKED_SONGS_FAILURE, payload: error.message });
  }
};

export const unlikeSong = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: UNLIKE_SONG_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    // Make a DELETE request to unlike the song
    await instance.request({
      method: 'DELETE',
      url: `/api/songs/${id}/deleteLike/`,
      headers: config.headers,
    });

    dispatch({ type: UNLIKE_SONG_SUCCESS });
  } catch (error) {
    dispatch({
      type: UNLIKE_SONG_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
}


export const fetchSongsByGenre = (genre) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_SONGS_BY_GENRE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const response = await instance.get(`/api/songs/genres/${genre}`, config);
    console.log('Response from fetchSongsByGenre:', response.data); // Add this line to log the response data

    dispatch({ type: FETCH_SONGS_BY_GENRE_SUCCESS, payload: response.data });
  } catch (error) {
    console.log('Error in fetchSongsByGenre:', error); // Add this line to log any errors
    dispatch({
      type: FETCH_SONGS_BY_GENRE_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const searchSongs = (query) => async (dispatch) => {
  try {
    dispatch({ type: SONG_SEARCH_REQUEST });

    // Ensure that query is defined before making the request
    const url = query ? `/api/songs/search?query=${query}` : '/api/songs';

    const { data } = await axios.get(url);

    dispatch({
      type: SONG_SEARCH_SUCCESS,
      payload: data, // Dispatch SONG_SEARCH_SUCCESS with the search results payload
    });
  } catch (error) {
    dispatch({
      type: SONG_SEARCH_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const playlistView = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PLAYLIST_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const { data } = await instance.get(`/api/songs/playlist/`, config);
    dispatch({ type: PLAYLIST_LIST_SUCCESS, payload: data });
  } catch (error) {
    console.log('Error in playlistView:', error);
    dispatch({
      type: PLAYLIST_LIST_FAILURE,
      payload: error.message && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const playlistDetailView = (id) => async (dispatch, getState) => {
  try {
    console.log('Dispatching PLAYLIST_DETAILS_REQUEST');
    dispatch({ type: PLAYLIST_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const response = await axios.get(`/api/songs/playlist/${id}`, config);
    dispatch({ type: PLAYLIST_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: PLAYLIST_DETAILS_FAILURE, payload: error.message });
  }
};


export const addPlaylist = (playlist) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_PLAYLIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }


    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const response = await axios.post('/api/songs/addPlaylist/', playlist, config);
    dispatch({ type: ADD_PLAYLIST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ADD_PLAYLIST_FAILURE, payload: error.message });
  }
}


export const fetchMySongs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_SONGS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    console.log('Fetching My Songs');

    const response = await axios.get('/api/songs/mySongs/', config);
    console.log('Fetch My Songs Response:', response.data); // Add this line to see the response
    dispatch({ type: MY_SONGS_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Fetch My Songs Error:', error); // Add this line to see any errors
    dispatch({ type: MY_SONGS_FAILURE, payload: error.message });
  }
};

export const fetchMyPlaylists = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_PLAYLISTS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo?.data?.token?.access) {
      throw new Error('User information is missing or incomplete');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.data.token.access}`,
      },
    };

    const response = await axios.get('/api/songs/myPlaylists/', config);
    dispatch({ type: MY_PLAYLISTS_SUCCESS, payload: response.data });
    console.log('My Playlists:', response.data);
  } catch (error) {
    dispatch({ type: MY_PLAYLISTS_FAILURE, payload: error.message });
  }
}

