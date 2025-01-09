import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "./DoctorNavbar";
import "../styles/add.css";
const AddPrescription = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !contents) {
      setMessage('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/doctor/prescription', {
        patientId,
        title,
        contents,
      });
      alert('Prescription added successfully!');
      navigate(`/doctor/individualPatient/${patientId}`);
    } catch (error) {
      setMessage('Error adding prescription');
      console.error('Error:', error);
    }
  };

  return (
    <div>
    <Navbar />
    <div className="form-container">
      <h2 className="form-heading">Add Prescription</h2>
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="form-label">Contents</label>
        <textarea
          className="form-textarea"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="form-button">Add Prescription</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
    </div>
  );
};

export default AddPrescription;
