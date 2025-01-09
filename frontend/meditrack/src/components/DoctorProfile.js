import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./DoctorNavbar";
import "../styles/Profile.css";
import { FaEdit } from 'react-icons/fa';

const DoctorProfile = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor/session", { withCredentials: true });
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile details.");
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate("/Doctor/update");
  };

  return (
    <>
      <Navbar />
      <br />
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
    <h1>Doctor's Profile</h1>
    <div className="profile-info">
      <strong>specialization:</strong> {profile.specialization}
      <strong>Phone:</strong> {profile.phone || "edit to add"}
      <strong>clinic name:</strong> {profile.clinic_name || "edit to add"}
      <strong>clinic Address:</strong> {profile.clinic_address|| "edit to add"}
    </div>
  </div>
</div>

        )}
      </div>
    </>
  );
};

export default DoctorProfile;