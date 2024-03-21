import axios from 'axios'; // Correct the import statement
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
    USER_CONTACT_US_REQUEST,
    USER_CONTACT_US_SUCCESS,
    USER_CONTACT_US_FAIL,
    ARTIST_REGISTER_REQUEST,
    ARTIST_REGISTER_SUCCESS,
    ARTIST_REGISTER_FAILURE,
    ARTIST_VERIFY_REQUEST,
    ARTIST_VERIFY_SUCCESS,
    ARTIST_VERIFY_FAILURE,
    GET_USER_PROFILE_REQUEST,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_FAILURE,
    USER_UPDATE_SUBSCRIBER_REQUEST,
    USER_UPDATE_SUBSCRIBER_SUCCESS,
    USER_UPDATE_SUBSCRIBER_FAIL
} from '../constants/userConstants';


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


// ... (your imports and axios instance)

export const logout = (navigate) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    // Display confirmation message
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      if (userInfo?.data?.token?.access) {
        await instance.post('api/user/logout/');
      }

      localStorage.removeItem('userInfo');
      dispatch({ type: USER_LOGOUT });
      navigate('/');
    }
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
  
  export const updateUserProfile = (updatedUser, profilePicture) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_UPDATE_PROFILE_REQUEST,
      });
  
      const { userLogin: { userInfo } } = getState();
  
      if (!userInfo?.data?.token?.access) {
        throw new Error('User information is missing or incomplete');
      }
  
      const formData = new FormData();
  
      formData.append('name', updatedUser.name || '');
      formData.append('email', updatedUser.email || '');
      formData.append('color', updatedUser.color || '#defaultColor');
      formData.append('font', updatedUser.font || 'defaultFont');
  
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.data.token.access}`,
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const { data } = await axios.put(`/api/user/profile/update`, formData, config);
  
      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });
  
    } catch (error) {
      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload: error.message && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };
  

export const contactUs = (name, email, message) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_CONTACT_US_REQUEST
    });



    const config = {
      headers: {
        'Content-Type': 'application/json',

      }
    };

    const response = await instance.post(
      'api/user/contact-us/',
      { name, email, message },
      config
    );

    dispatch({
      type: USER_CONTACT_US_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: USER_CONTACT_US_FAIL,
      payload: error.response ? error.response.data : 'Contact us failed'
    });
  }
};

export const artistVerify = (token) => async (dispatch) => {
  try {
      dispatch({ type: ARTIST_VERIFY_REQUEST });

      const response = await instance.get(`api/user/verify-artist/${token}/`);
      console.log('Verify Artist API Response:', response);
      console.log(token)

      dispatch({
          type: ARTIST_VERIFY_SUCCESS,
          payload: response.data
      });
  } catch (error) {
      dispatch({
          type: ARTIST_VERIFY_FAILURE,
          payload: error.response ? error.response.data : 'Failed to verify artist'
      });
  }
};

export const artistRegister = ( phone_number, youtube_link)  => async (dispatch, getState) => {
  try {
    dispatch({
      type: ARTIST_REGISTER_REQUEST
    });

    const { userLogin: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.data.token.access}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await instance.post('api/user/artist-register/', {phone_number, youtube_link}, 
      config);

      dispatch({
        type: ARTIST_REGISTER_SUCCESS,
        payload: response.data 
      });
      // If artist registration was successful, dispatch artistVerify to trigger artist verification
      if (response.data && response.data.artist_id) {
        dispatch(artistVerify(response.data.artist_id));
    }
    } catch (error) {
      dispatch({
        type: ARTIST_REGISTER_FAILURE,
        payload: error.response ? error.response.data : 'Failed to register'
      });
    }
  };




  
  export const userProfile = (userId) => async (dispatch) => {
    try {
      dispatch({ type: GET_USER_PROFILE_REQUEST });
  
      const { data } = await axios.get(`/api/user/user-profile/${userId}`);
  
      dispatch({
        type: GET_USER_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_USER_PROFILE_FAILURE,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };

  // export const userProfile = {
  //   getUserProfile: () => async (dispatch, getState) => {
  //     try {
  //       dispatch({
  //         type: GET_USER_PROFILE_REQUEST,
  //       });
    
  //       const {
  //         userLogin: { userInfo },
  //       } = getState();
    
  //       if (!userInfo?.data?.token?.access) {
  //         // If userInfo or its properties are undefined, handle it accordingly
  //         throw new Error('User information is missing or incomplete');
  //       }
    
  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${userInfo.data.token.access}`,
  //         },
  //       };
    
  //       const { data } = await instance.get(`api/user/user-profile/`, config);
    
  //       dispatch({
  //         type: GET_USER_PROFILE_SUCCESS,
  //         payload: data,
  //       });
  //     } catch (error) {
  //       dispatch({
  //         type: GET_USER_PROFILE_FAILURE,
  //         payload: error.response
  //           ? error.response.data.message
  //           : error.message || 'Error fetching user profile',
  //       });
  //     }
  //   }
  // };


  export const userUpdateSubscriber = (subscriber) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_UPDATE_SUBSCRIBER_REQUEST });
      
      const { userLogin: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.data.token.access}`,
          'Content-Type': 'application/json'
        }
      };
  
      // Make API call to update user's subscription status
      const response = await instance.post('api/user/subscriber/', { subscriber }, config);
  
      // Dispatch success action with the updated subscriber data
      dispatch({ type: USER_UPDATE_SUBSCRIBER_SUCCESS, payload: response.data });
    } catch (error) {
      // Dispatch fail action if there's an error
      dispatch({
        type: USER_UPDATE_SUBSCRIBER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };