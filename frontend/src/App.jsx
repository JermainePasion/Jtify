import React from 'react';
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


const isAuthenticated = () => {
  return localStorage.getItem('userInfo') !== null;
};


function App() {
  const dispatch = useDispatch();

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/" replace />}
        />
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
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
        <Route path="/songs/:id" element={<SongDetailView />} />
        <Route path="/add-songs" element={<AddSong />} />
        <Route
          path="/contact"
          element={isAuthenticated() ? <ContactLoggedIn /> : <ContactLoggedOut />}
        />
      </Routes>
    </Router>
  );
}

export default App;
