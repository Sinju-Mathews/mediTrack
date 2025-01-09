import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // To make API calls
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      // Single API call for both doctor and patient login
      const response = await axios.post("http://localhost:5000/api/login", credentials);
      const { role } = response.data;

      if (role === "doctor") {
        navigate("/doctor/home"); // Redirect without ID for doctor
      } else if (role === "patient") {
        navigate("/patient/home"); // Redirect without ID for patient
      }
    } catch (err) {
      setError(err.response?.data?.message || "Wrong credentials");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <div className="login-left">
        {error && <p className="error-message">{error}</p>}
          <img src="/assets/img2.jpg" alt="MediTrack" className="side-image" />
        </div>

        <div className="login-right">
        
          <div className="log-title">
            <img src="/assets/logo.png" alt="MediTrack Logo" className="log animated-logo" />
          </div>
          <h1 className="title">MediTrack</h1>
          
          {/* Removed the "Please log in to continue" text */}
          
          <div className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
            />
            
            <button className="login-button" onClick={handleLogin}>Log In</button>
          </div>
          <p className="register-text">New here? Register as:</p>
          <div className="role-buttons">
            <button className="register-button doctor" onClick={() => navigate("/register/doctor")}>
              Doctor
            </button>
            <button className="register-button patient" onClick={() => navigate("/register/patient")}>
              Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
