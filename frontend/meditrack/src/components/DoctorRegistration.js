import React, { useState } from "react";
import { registerDoctor } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/registration.css";

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    clinicName: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerDoctor(formData);
      setMessage(response.message); 
      alert('Successfully Registered');
      navigate("/"); 
    } catch (error) {
      setMessage(error); 
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="doctor-registration-form">
        <h2 className="registration-heading">Doctor Registration</h2>
        {message && <p className="registration-message">{message}</p>}
        
        <label className="registration-label">Name:</label>
        <input className="registration-input" type="text" name="name" onChange={handleChange} required />

        <label className="registration-label">Email:</label>
        <input className="registration-input" type="email" name="email" onChange={handleChange} required />

        <label className="registration-label">Password:</label>
        <input className="registration-input" type="password" name="password" onChange={handleChange} required />

        <label className="registration-label">Specialization:</label>
        <input className="registration-input" type="text" name="specialization" onChange={handleChange} required />

        <label className="registration-label">Clinic Name:</label>
        <input className="registration-input" type="text" name="clinicName" onChange={handleChange} required />

        <button type="submit" className="registration-button">Register</button>
      </form>
    </div>
  );
};

export default DoctorRegistration;

