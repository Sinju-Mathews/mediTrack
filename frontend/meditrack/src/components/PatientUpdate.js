import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./PatientNavbar";
import "../styles/UpdateProfile.css";

const PatientUpdate = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    photo: null,
  });
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
      await axios.put("http://localhost:5000/api/patient/update", formData, { withCredentials: true });
      navigate("/patient/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="update-profile-container">
  {error && <p className="error-message">{error}</p>}
  <form onSubmit={handleSubmit} encType="multipart/form-data">
    <h1>Edit Profile</h1>

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

    <label>Date of Birth:</label>
    <input
      type="text"
      name="dob"
      value={profile.dob}
      onChange={handleChange}
      required
    />

    <label>Gender:</label>
    <select
      name="gender"
      value={profile.gender}
      onChange={handleChange}
      required
    >
      <option value="" disabled>
        Select Gender
      </option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    <label>Phone:</label>
    <input
      type="text"
      name="phone"
      value={profile.phone}
      onChange={handleChange}
    />

    <label>Address:</label>
    <textarea
      name="address"
      value={profile.address}
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

export default PatientUpdate;
