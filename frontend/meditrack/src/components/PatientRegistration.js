import React, { useState } from "react";
import { registerPatient } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/registration.css";


const PatientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerPatient(formData);
      setMessage(response.message); 
      alert('Successfully Registered');
      navigate("/"); 
    } catch (error) {
      setMessage(error); 
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="patient-registration-form">
        <h2 className="registration-heading">Patient Registration</h2>
        {message && <p className="registration-message">{message}</p>}
        
        <label className="registration-label">Name:</label>
        <input className="registration-input" type="text" name="name" onChange={handleChange} required />

        <label className="registration-label">Email:</label>
        <input className="registration-input" type="email" name="email" onChange={handleChange} required />

        <label className="registration-label">Password:</label>
        <input className="registration-input" type="password" name="password" onChange={handleChange} required />

        <label className="registration-label">Date of Birth:</label>
        <input className="registration-input" type="date" name="dob" onChange={handleChange} required />

        <label className="registration-label">Gender:</label>
        <select className="registration-select" name="gender" onChange={handleChange} required>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button type="submit" className="registration-button">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistration;

