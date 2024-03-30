import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk'; // Correct the import statement
import {userLoginReducer} from './reducers/userReducers'; // Correct the import statement
import {userSendChangePasswordReducer} from './reducers/userReducers'; // Correct the import statement
import {userRegisterReducer} from './reducers/userReducers'; // Correct the import statement
import {userConfirmChangePasswordReducer} from './reducers/userReducers'; // Correct the import statement
import {userVerifyOtpReducer} from './reducers/userReducers'; // Correct the import statement
import {userDetailsReducer} from './reducers/userReducers';
import {userUpdateProfileReducer} from './reducers/userReducers'; // Import the new reducer
import songListReducer, { songAddReducer } from './reducers/songReducer'; 
import songDetailReducer from './reducers/songReducer'; // Import the new reducer
import songEditReducer from './reducers/songReducer'; // Import the new reducer
import { likeSongReducer } from './reducers/songReducer';
import songSearchReducer from './reducers/songReducer';
import { fetchLikedSongsReducer } from './reducers/songReducer';
import { contactUsReducer } from './reducers/userReducers'; 
import  songGenreReducer  from './reducers/songReducer';
import { artistRegisterReducer } from './reducers/userReducers';
import playlistDetailViewReducer from './reducers/songReducer'; 
import playlistReducer from './reducers/songReducer'; 
import addPlaylistReducer from './reducers/songReducer'; 
import mySongsReducer from './reducers/songReducer';
import myPlaylistsReducer from './reducers/songReducer';
import uploadSongToPlaylistReducer from './reducers/songReducer';
import { userProfileReducer } from './reducers/userReducers';
import { adsUploadReducer } from './reducers/adsReducer';
import {adslistReducer} from './reducers/adsReducer'; // Import the new reducer
import {artistVerifyReducer} from './reducers/userReducers';
import {updateSubscriberReducer} from './reducers/userReducers';
import { adminPanelReducer } from './reducers/userReducers';
import { playerReducer } from './reducers/musicPlayerReducer';

const reducer = combineReducers({
    userLogin: userLoginReducer,
    adsList: adslistReducer,
    userRegister: userRegisterReducer,
    userSendChangePassword: userSendChangePasswordReducer,
    userConfirmChangePassword: userConfirmChangePasswordReducer,
    userVerifyOtp: userVerifyOtpReducer,
    songList: songListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    songDetail: songDetailReducer,
    songEdit: songEditReducer,
    likeSong: likeSongReducer,
    fetchLikedSongs: fetchLikedSongsReducer,
    contactUs: contactUsReducer,
    songGenre: songGenreReducer,
    songSearch: songSearchReducer,
    artistRegister: artistRegisterReducer,
    playlistView: playlistReducer,
    playlistDetail: playlistDetailViewReducer,
    addPlaylist: addPlaylistReducer,
    mySongs: mySongsReducer,
    myPlaylist: myPlaylistsReducer,
    uploadSongstoPlaylist: uploadSongToPlaylistReducer,
    userProfile: userProfileReducer,
    adsUpload: adsUploadReducer,
    artistVerify:artistVerifyReducer,
    updateSubscriber: updateSubscriberReducer,
    adminPanel : adminPanelReducer,
    adminPanelUsers: adminPanelReducer,
    player: playerReducer
});

const currentlyPlayingFromStorage = localStorage.getItem(
    "currentlyPlayingNiMiah"
  );
const visibilityFromStorage = localStorage.getItem("visibilityNiMiah");
  
const initialState = {
    userLogin: {
      userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    },
    player: {
      currentlyPlayingSong: currentlyPlayingFromStorage
        ? JSON.parse(currentlyPlayingFromStorage)
        : null,
      isVisible: visibilityFromStorage
        ? JSON.parse(visibilityFromStorage)
        : false, // Default visibility to false if not found in localStorage
    },
  };

const middleware = [thunk];

const store = configureStore({
    reducer,
    preloadedState: initialState, // Correct the property name to preloadedState
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});





export default store;
