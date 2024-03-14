import { USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGIN_FAIL, 
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_SEND_CHANGE_PASSWORD_REQUEST,
    USER_SEND_CHANGE_PASSWORD_SUCCESS,
    USER_SEND_CHANGE_PASSWORD_FAIL,
    USER_CONFIRM_CHANGE_PASSWORD_REQUEST,
    USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
    USER_CONFIRM_CHANGE_PASSWORD_FAIL,
    USER_VERIFY_OTP_REQUEST,
    USER_VERIFY_OTP_SUCCESS,
    USER_VERIFY_OTP_FAIL,
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
    GET_USER_PROFILE_REQUEST,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_FAILURE
 } 
from '../constants/userConstants';




export const userLoginReducer = (state = {}, action) => {
    switch(action.type){
        case USER_LOGIN_REQUEST:
            return {loading: true}
        case USER_LOGIN_SUCCESS:
            return {loading: false, userInfo: action.payload}
        case USER_LOGIN_FAIL:
            return {loading: false, error: action.payload}
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch(action.type){
        case USER_REGISTER_REQUEST:
            return {loading: true}
        case USER_REGISTER_SUCCESS:
            return {loading: false, userInfo: action.payload}
        case USER_REGISTER_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export const userSendChangePasswordReducer = (state = {}, action) => {
    switch(action.type){
        case USER_SEND_CHANGE_PASSWORD_REQUEST:
            return {loading: true}
        case USER_SEND_CHANGE_PASSWORD_SUCCESS:
            return {loading: false, success: true}
        case USER_SEND_CHANGE_PASSWORD_FAIL:
            return {loading: false, error: action.payload}
        // case USER_SEND_CHANGE_PASSWORD_RESET:
        //     return {}
        default:
            return state
    }
}

export const userConfirmChangePasswordReducer = (state = {}, action) => {
    switch(action.type){
        case USER_CONFIRM_CHANGE_PASSWORD_REQUEST:
            return {loading: true}
        case USER_CONFIRM_CHANGE_PASSWORD_SUCCESS:
            return {loading: false, success: true}
        case USER_CONFIRM_CHANGE_PASSWORD_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export const userVerifyOtpReducer = (state = {}, action) => {
    switch(action.type){
        case USER_VERIFY_OTP_REQUEST:
            return {loading: true}
        case USER_VERIFY_OTP_SUCCESS:
            return {loading: false, success: true}
        case USER_VERIFY_OTP_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export const resendOtpReducer = (state = {}, action) => {
    switch(action.type){
        case USER_RESEND_OTP_REQUEST:
            return {loading: true}
        case USER_RESEND_OTP_SUCCESS:
            return {loading: false, success: true}
        case USER_RESEND_OTP_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {
      case USER_DETAILS_REQUEST:
        return { ...state, loading: true };
      case USER_DETAILS_SUCCESS:
        return { loading: false, user: action.payload };
      case USER_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_UPDATE_PROFILE_REQUEST:
        return { loading: true };
      case USER_UPDATE_PROFILE_SUCCESS:
        return { loading: false, success: true, userInfo: action.payload };
      case USER_UPDATE_PROFILE_FAIL:
        return { loading: false, error: action.payload };
      case USER_UPDATE_PROFILE_RESET:
        return {};
      default:
        return state;
    }
  };

export const contactUsReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_CONTACT_US_REQUEST:
        return { loading: true };
      case USER_CONTACT_US_SUCCESS:
        return { loading: false, success: true, userInfo: action.payload };
      case USER_CONTACT_US_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  }
  
export const artistRegisterReducer = (state = {}, action)  => {
    switch (action.type) {
      case ARTIST_REGISTER_REQUEST:
        return {loading: true,};
      case ARTIST_REGISTER_SUCCESS:
        return {loading: false,success: true, userInfo: action.payload};
      case ARTIST_REGISTER_FAILURE:
        return {loading: false,error: action.payload};
      default:
        return state;
    }
  };

export const userProfileReducer = (state = {}, action)  => {
    switch (action.type) {
      case GET_USER_PROFILE_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case GET_USER_PROFILE_SUCCESS:
        return {
          ...state,
          loading: false,
          profile: action.payload.profile,
          uploadedSongs: action.payload.uploadedSongs,
          createdPlaylists: action.payload.createdPlaylists,
          error: null
        };
      case GET_USER_PROFILE_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
