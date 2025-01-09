import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "./DoctorNavbar";
import "../styles/add.css";

const AddMedicalReport = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({
    title: '',
    file: null,
  });
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  // Handle file input separately
  const handleFileChange = (e) => {
    setReport({ ...report, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!report.title || !report.file) {
      setMessage('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('title', report.title);
    formData.append('file', report.file);

    try {
      await axios.post('http://localhost:5000/api/doctor/medical-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Medical report added successfully!');
      navigate(`/doctor/individualPatient/${patientId}`);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error adding medical report');
    }
  };

  return (
    <div>
    <Navbar />
    <div className="form-container">
      <h2 className="form-heading">Add Medical Report</h2>
      <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
        <label className="form-label" htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          className="form-input"
          value={report.title}
          onChange={handleChange}
          required
        />
        <label className="form-label" htmlFor="file">Upload File:</label>
        <input
          type="file"
          name="file"
          id="file"
          className="form-file"
          onChange={handleFileChange}
          required
        />
        <button type="submit" className="form-button">Add Medical Report</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
    </div>
  );
};

export default AddMedicalReport;
