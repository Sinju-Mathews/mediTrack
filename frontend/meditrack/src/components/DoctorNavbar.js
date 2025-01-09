import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import { FaArrowLeft } from "react-icons/fa"; // Back icon 
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [user, setUser] = useState(null); // State to store the logged-in user info
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the session data to identify the logged-in user
    const fetchUserSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/session");
        setUser(response.data); // Set user info in state
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };
    fetchUserSession();
  }, []);

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleHome = () => {
    navigate("/doctor/home"); // Navigate to the home page
  };

  const handleMyPatients = () => {
    navigate("/doctor/mypatients"); // Navigate to "My Patients"
  };

  const handleProfile = () => {
    navigate("/doctor/profile"); // Navigate to "My Profile"
  };

  const handleLogout = async () => {
    // Add logout functionality (e.g., clear session and redirect)
    try {
      await axios.post("http://localhost:5000/api/logout"); // Endpoint for logout
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft className="back-icon" />
        </button>
        <div className="logo" onClick={handleHome} style={{ cursor: "pointer" }}>
          <img
            src="/assets/logo.png" // Replace with your logo's actual path
            alt="MediTrack Logo"
            className="logo-img"
          />
          <span className="logo-text">MediTrack</span>
        </div>
        <div className="nav-btns">
          <button className="nav-button2 home-button" onClick={handleHome}>
          Home
        </button>
        <button className="nav-button2 mypatients-button" onClick={handleMyPatients}>
          My Patients
        </button>
        <button className="nav-button2 myprofile-button" onClick={handleProfile}>
          My Profile
        </button></div>
        
      </div>
      <div className="navbar-right">
         {user && (
          <button
            className="nav-button profile-button"
            onClick={handleProfile}
          >
            <i className="fas fa-user"></i> {/* Profile Icon */}
          </button>
        )}
        <button
          className="nav-button logout-button"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt"></i> {/* Logout Icon */}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
