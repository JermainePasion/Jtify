import React, { useEffect, useState } from 'react';
import { getUserDetails } from './actions/userActions';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SongDetailView from './components/pages/SongDetailView';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import RequestChangePass from './components/pages/RequestChangePass';
import OTPVerification from './components/pages/OTPVerification';
import ConfirmChangePass from './components/pages/ConfirmChangePass';
import Profile from './components/pages/Profile';
import './App.css';
import Favorites from './components/pages/Favorites';
import AddSong from './components/pages/AddSong';
import ContactLoggedOut from './components/pages/ContactLoggedOut';
import ContactLoggedIn from './components/pages/ContactLoggedIn'; // Import ContactLoggedIn component
import Discovery from './components/pages/Discovery';
import ArtistRegister from './components/pages/ArtistRegister';
import PlaylistDetailView from './components/pages/PlaylistDetailView';
import AddPlaylistScreen from './components/pages/AddPlaylistScreen';
import MyPlaylistScreen from './components/pages/MyPlaylistScreen';
import MySongsScreen from './components/pages/MySongsScreen';
import ArtistProfile from './components/pages/ArtistProfile';
import Ads from './components/pages/Ads';
import AdEditForm from './components/pages/AdEditForm';
import AdUploadForm from './components/pages/AdUploadForm';
import AdDetails from './components/pages/AdDetails';
import VerifyArtist from './components/pages/VerifyArtist';
import Plans from './components/pages/Plans';
import AdminPanel from './components/pages/AdminPanel';
import { useSelector } from 'react-redux';
import Errorpage from './components/pages/Errorpage';
import PlayerNiMiah from './components/PlayerNiMiah';





function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const user = useSelector(state => state.userDetails.user);

  useEffect(() => {
    const fetchUserData = async () => {
      await dispatch(getUserDetails()); // Dispatch action to fetch user details
      setIsLoading(false); // Set loading to false once data is fetched
    };
    fetchUserData();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Render loading indicator while fetching user data
  }

  const isAuthenticated = () => {
    return localStorage.getItem('userInfo') !== null;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/" replace />}
        />
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/artistprofile/:id" element={<ArtistProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/artistregister" element={<ArtistRegister />} />

        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/verify-otp"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <OTPVerification />}
        />
        <Route path="/requestPassword" element={<RequestChangePass />} />
        <Route path="/reset/:uid/:token" element={<ConfirmChangePass />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/playlist/:id" element={<PlaylistDetailView />} />
        <Route path ="/plans" element = {<Plans/>} />
        <Route path="/error" element={<Errorpage />} />
        <Route path ="/verify-artist/:token" element = {<VerifyArtist/>} />


        {user?.data?.user_data?.is_superuser ? (
          <>
            <Route path="/adminpanel" element={<AdminPanel />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/ads/upload" element={<AdUploadForm />} />
            <Route path="/ads/edit/:id" element={<AdEditForm />} />
            <Route path="/ads/:id" element={<AdDetails />} />
            
          </>
        ) : (
          <>
            <Route path="/adminpanel" element={<Navigate to="/error" replace />} />
            <Route path="/ads" element={<Navigate to="/error" replace />} />
            <Route path="/ads/upload" element={<Navigate to="/error" replace />} />
            <Route path="/ads/edit/:id" element={<Navigate to="/error" replace />} />
            <Route path="/ads/:id" element={<Navigate to="/error" replace />} />
            
          </>
        )}
        

        {user?.data?.user_data?.is_artist ? (
          <>
            <Route path="/songs/:id" element={<SongDetailView />} />
            <Route path="/add-songs" element={<AddSong />} />
            <Route path="/add-playlist" element={<AddPlaylistScreen />} />
            <Route path="/myplaylist" element={<MyPlaylistScreen />} />
            <Route path="/mysongs" element={<MySongsScreen />} />
          </>
        ) : (
          <>
            <Route path="/songs/:id" element={<Navigate to="/error" replace />} />
            <Route path="/add-songs" element={<Navigate to="/error" replace />} />
            <Route path="/add-playlist" element={<Navigate to="/error" replace />} />
            <Route path="/myplaylist" element={<Navigate to="/error" replace />} />
            <Route path="/mysongs" element={<Navigate to="/error" replace />} />
          </>
        )}
        <Route
          path="/contact"
          element={isAuthenticated() ? <ContactLoggedIn /> : <ContactLoggedOut />}
        />
        
      </Routes>
      {isAuthenticated() && <PlayerNiMiah />}
    </Router>
  );
}

export default App;
