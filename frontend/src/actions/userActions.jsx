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
    USER_RESEND_OTP_FAIL
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


export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
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
          { 'email': email, 'name': name, 'password': password, 'password2': password2 },
          config
      );

      console.log('Register API Response:', response);

      dispatch({
          type: USER_REGISTER_SUCCESS,
          payload: response.data.data
      });

      // localStorage.setItem('userInfo', JSON.stringify(response.data.data));
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