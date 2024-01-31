// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/pages/Layout";
import Home from "./components/pages/Home";
import Contact from "./components/pages/Contact";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import RequestChangePass from "./components/pages/RequestChangePass";
import OTPVerification from "./components/pages/OTPVerification";
import ConfirmChangePass from "./components/pages/ConfirmChangePass";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/requestPassword" element={<RequestChangePass />} />
        <Route path="/reset/:uid/:token" element={<ConfirmChangePass />} />
        <Route path = "/verify-otp" element = {<OTPVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
