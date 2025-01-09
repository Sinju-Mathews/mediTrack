import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import { FaArrowLeft } from "react-icons/fa"; // Back icon 
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [user, setUser] = useState(null); // State to store the logged-in user info
  const navigate = useNavigate();

  

  return (
    <nav className="navbar">
      <div className="navbar-left">
        
        <div className="logo" >
          <img
            src="/assets/logo.png" // Replace with your logo's actual path
            alt="MediTrack Logo"
            className="logo-img"
          />
          <span className="logo-text">MediTrack</span>
        </div>
        
      </div>
   
    </nav>
  );
};

export default Navbar;
