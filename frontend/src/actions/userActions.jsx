import axios from 'axios'; // Correct the import statement
import { SONG_LIST_REQUEST, SONG_LIST_SUCCESS } from '../constants/songConstants';
import {
    USER_CONFIRM_CHANGE_PASSWORD_FAIL,
    USER_CONFIRM_CHANGE_PASSWORD_REQUEST,
    USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_SEND_CHANGE_PASSWORD_FAIL,
    USER_SEND_CHANGE_PASSWORD_REQUEST,
    USER_SEND_CHANGE_PASSWORD_SUCCESS,
    USER_VERIFY_OTP_FAIL,
    USER_VERIFY_OTP_REQUEST,
    USER_VERIFY_OTP_SUCCESS,
    USER_LOGOUT,
    USER_RESEND_OTP_REQUEST,
    USER_RESEND_OTP_SUCCESS,
    USER_RESEND_OTP_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_RESET,
    FETCH_LIKED_SONGS_REQUEST,
    FETCH_LIKED_SONGS_FAIL,
    FETCH_LIKED_SONGS_SUCCESS,
    ADD_LIKED_SONG,
    ADD_LIKED_SONG_SUCCESS,
    ADD_LIKED_SONG_FAILURE,
    MATCHED_SONGS_REQUEST,
    MATCHED_SONGS_SUCCESS,
    MATCHED_SONGS_FAIL
} from '../constants/userConstants';
import { listSongs } from './songActions';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await instance.post(
            'api/user/login/',
            { email, password },
            config
        );

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        });
    }
};


export const logout = (navigate) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    if (userInfo?.data?.token?.access) {
      await instance.post('api/user/logout/');
    }

    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
    navigate('/');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


export const register = (email, name, password, password2) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await instance.post(
      'api/user/register/',
      { 'email': email, 'name': name, 'password': password, 'password2': password2,  },
      config
    );

    console.log('Register API Response:', response);

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: response.data.data
    });

    return response.data.data; // Return only the relevant data

  } catch (error) {
    console.error('Register API Error:', error);

    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response ? error.response.data : 'Registration failed'
    });
    throw error;
  }
};
export const sendrequestChangePassword = (email) => async (dispatch) => {
    try {
        dispatch({
            type: USER_SEND_CHANGE_PASSWORD_REQUEST
        });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await instance.post(
            'api/user/send-reset-password-email/',
            { email },
            config
        );

        dispatch({
            type: USER_SEND_CHANGE_PASSWORD_SUCCESS,
        });

    } catch (error) {
        dispatch({
            type: USER_SEND_CHANGE_PASSWORD_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        });
    }
} 

export const userConfirmChangePasswordReducer = (password, password2) => async (dispatch) => {
    try {
        dispatch({
            type: USER_CONFIRM_CHANGE_PASSWORD_REQUEST
        });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await instance.post(
            'reset-password/<uid>/<token>/',
            { password, password2 },
            config
        );

        dispatch({
            type: USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type:   USER_CONFIRM_CHANGE_PASSWORD_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        });
    }
}

export const verifyOTP = (user_id, otp_id, otp_code) => async (dispatch) => {
    try {
      dispatch({
        type: USER_VERIFY_OTP_REQUEST,
      });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await instance.post(
        'api/user/verify-otp/', // Updated to match your API endpoint
        { user_id, otp_id, otp_code },
        config
      );
  
      dispatch({
        type: USER_VERIFY_OTP_SUCCESS,
      });
      return data;
    } catch (error) {
      dispatch({
        type: USER_VERIFY_OTP_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };


  export const resendOTP = (user_id, otp_id) => async (dispatch) => {
    try {
      dispatch({
        type: USER_RESEND_OTP_REQUEST,
      });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await instance.post(
        'api/user/resend-otp/',
        { user_id, otp_id },
        config
      );
  
      dispatch({
        type: USER_RESEND_OTP_SUCCESS,
        payload: data, // Make sure to include the response data in the payload
      });
  
      return data; // Return the response data
  
    } catch (error) {
      dispatch({
        type: USER_RESEND_OTP_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  
  export const getUserDetails = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_DETAILS_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      if (!userInfo?.data?.token?.access) {
        // If userInfo or its properties are undefined, handle it accordingly
        throw new Error('User information is missing or incomplete');
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.data.token.access}`,
        },
      };
  
      const { data } = await instance.get(`api/user/profile/`, config);
  
      dispatch({
        type: USER_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_DETAILS_FAIL,
        payload: error.response
          ? error.response.data.message
          : error.message || 'Error fetching user details',
      });
    }
  };
  
  export const resetUpdateProfile = () => (dispatch) => {
    dispatch({ type: USER_UPDATE_PROFILE_RESET });
  };
  
  export const updateUserProfile = (updatedUser) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_UPDATE_PROFILE_REQUEST,
      });
  
      const { userLogin: { userInfo } } = getState();
  
      if (!userInfo?.data?.token?.access) {
        throw new Error('User information is missing or incomplete');
      }
  
      const formData = new FormData();
  
      formData.append('name', updatedUser.name);
      formData.append('email', updatedUser.email);
      formData.append('color', updatedUser.color);
      formData.append('font', updatedUser.font);
  
      if (updatedUser.profile?.image) {
        formData.append('profile_picture', updatedUser.profile.image);
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.data.token.access}`,
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const { data } = await instance.put('api/user/profile/update', formData, config);
  
      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });
  
      // Reset the state after a successful update
      dispatch(resetUpdateProfile());
    } catch (error) {
      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload: error.response
          ? error.response.data.message
          : error.message || 'Error updating user profile',
      });
    }
  };


  export const likedSongsList = () => async (dispatch, getState) => {
    try {
      dispatch({ type: FETCH_LIKED_SONGS_REQUEST });
  
      const { userLogin: { userInfo } } = getState();
  
      if (!userInfo?.data?.token?.access) {
        throw new Error('User information is missing or incomplete');
      }
  
      const userId = userInfo.data.id;
  
      const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/liked-songs/`, {
        headers: {
          Authorization: `Bearer ${userInfo.data.token.access}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch liked songs');
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const likedSongsData = await response.json();
        dispatch({ type: FETCH_LIKED_SONGS_SUCCESS, payload: likedSongsData });
  
        // No need to dispatch listSongs() here as it's dispatched in the reducer
  
      } else {
        throw new Error('Unexpected response format: not JSON');
      }
    } catch (error) {
      console.error('Error fetching liked songs:', error);
      dispatch({ type: FETCH_LIKED_SONGS_FAIL, payload: error.message });
    }
  };

  


