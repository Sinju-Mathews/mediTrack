import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./PatientNavbar";
import "../styles/Profile.css";
import { FaEdit } from 'react-icons/fa';

const PatientProfile = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patient/session", { withCredentials: true });
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile details.");
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate("/Patient/update");
  };

  return (
    <>
      <Navbar />
      <br />
      <div className="profile-container">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="profile-card">
  <div className="photo-container">
    <img
      src={profile.photo ? `${profile.photo}` : "/assets/default-avatar.png"}
      alt="Profile"
      className="profile-photo"
    />
    <div className="name-email">
      <strong className='name'> {profile.name}</strong>
      <br />
      <strong>Email:</strong> {profile.email}
    </div>
  </div>
  <div className="details-container">
    <button className="edit-button" onClick={handleEdit}>
      <FaEdit />
    </button>
    <h1>Patient's Profile</h1>
    <div className="profile-info">
      <strong>Date of Birth:</strong> {profile.dob}
      <strong>Gender:</strong> {profile.gender}
      <strong>Phone:</strong> {profile.phone || "edit to add"}
      <strong>Address:</strong> {profile.address || "edit to add"}
    </div>
  </div>
</div>

        )}
      </div>
    </>
  );
};

export default PatientProfile;