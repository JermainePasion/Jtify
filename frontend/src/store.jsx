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


const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userSendChangePassword: userSendChangePasswordReducer,
    userConfirmChangePassword: userConfirmChangePasswordReducer,
    userVerifyOtp: userVerifyOtpReducer,
    songList: songListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    songDetail: songDetailReducer,
    songEdit: songEditReducer,
    songAdd: songAddReducer,
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
});

const initialState = {
    userLogin: {
        userInfo: localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null,
    },

};

const middleware = [thunk];

const store = configureStore({
    reducer,
    preloadedState: initialState, // Correct the property name to preloadedState
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});





export default store;
