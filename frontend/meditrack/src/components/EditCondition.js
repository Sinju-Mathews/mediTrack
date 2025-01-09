import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./DoctorNavbar";
import "../styles/add.css";
const EditCondition = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [disease, setCondition] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the current condition (if any) to pre-fill the input
    axios
      .get(`http://localhost:5000/api/doctor/patient/${patientId}`)
      .then((response) => setCondition(response.data.disease || ''))
      .catch((error) => console.error('Error fetching patient condition:', error));
  }, [patientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disease) {
      setMessage('Condition cannot be empty');
      return;
    }

    axios
      .put(`http://localhost:5000/api/doctor/patient/${patientId}/condition`, { disease })
      .then(() => {
        alert('Condition updated successfully!');
        navigate(`/doctor/individualPatient/${patientId}`);
      })
      .catch((error) => {
        console.error('Error updating condition:', error);
        setMessage('Error updating condition');
      });
  };

  return (
    <div>
    <Navbar />
    <div className="form-container">
      <h2 className="form-heading">Edit Patient Condition</h2>
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label" htmlFor="condition">Condition:</label>
        <input
          type="text"
          id="condition"
          className="form-input"
          value={disease}
          onChange={(e) => setCondition(e.target.value)}
        />
        <button type="submit" className="form-button">Save</button>
        <button
          type="button"
          className="form-button form-cancel-button"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
    </div>
  );
};

export default EditCondition;
