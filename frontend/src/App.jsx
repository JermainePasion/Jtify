import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/pages/Home";
import Contact from "./components/pages/Contact";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import RequestChangePass from "./components/pages/RequestChangePass";
import OTPVerification from "./components/pages/OTPVerification";
import ConfirmChangePass from "./components/pages/ConfirmChangePass";
import Profile from "./components/pages/Profile";
import './App.css';


// Example: replace this with your actual authentication check logic
const isAuthenticated = () => {
  // Check if the user is authenticated, e.g., by verifying the presence of a token in local storage
  return localStorage.getItem('userInfo') !== null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
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
      </Routes>
    </Router>
  );
}

export default App;