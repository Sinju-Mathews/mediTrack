import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./DoctorNavbar";
import "../styles/UpdateProfile.css";

const DoctorUpdate = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    clinic_name: "",
    clinic_address: "",
    photo: null,
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfile({ ...profile, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(profile).forEach((key) => {
      formData.append(key, profile[key]);
    });

    try {
      await axios.put("http://localhost:5000/api/doctor/update", formData, { withCredentials: true });
      navigate("/doctor/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <div className="update-profile-container">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h1>Edit Your Profile</h1>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />

          <label>Specialization:</label>
          <input
            type="text"
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            required
          />

          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />

          <label>Clinic Name:</label>
          <input
            type="text"
            name="clinic_name"
            value={profile.clinic_name}
            onChange={handleChange}
          />

          <label>Clinic Address:</label>
          <textarea
            name="clinic_address"
            value={profile.clinic_address}
            onChange={handleChange}
            rows="3"
          ></textarea>

          <label>Profile Photo:</label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
          />

          <button className="update-button" type="submit">Save Changes</button>
        </form>
      </div>

    </>
  );
};

export default DoctorUpdate;
