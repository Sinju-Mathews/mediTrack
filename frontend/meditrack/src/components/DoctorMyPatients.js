// Importing necessary libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/DoctorNavbar";
import "../styles/DoctorMyPatients.css"; // Importing the CSS file

const DoctorMyPatients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // Function to fetch patients from the API
  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctor/patients"); // Fetch patients
      setPatients(response.data); // Set patients data
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  // Handle click on a patient card
  const handlePatientClick = (id) => {
    // Navigate to the individualPatient page with the patient's ID
    navigate(`/doctor/individualPatient/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="doctor-my-patients-container">
        <h1 className="heading">My Patients</h1>
        <div className="patients-list">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-crd"
              onClick={() => handlePatientClick(patient.id)}
            >
              <img
                src={patient.photo || "/assets/default.jpg"}
                alt={patient.name}
                className="patient-photo"
              />
              <h2 className="patient-name">{patient.name}</h2>
              <p className="patient-info">
                Age: {patient.dob ? calculateAge(patient.dob) : "Not specified"}
              </p>
              <p className="patient-info">Email: {patient.email}</p>
              <p className="patient-info">Phone: {patient.phone || "Not specified"}</p>
              <p className="patient-info">Gender: {patient.gender || "Not specified"}</p>
              <p className="patient-info">
                Condition: {patient.condition || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorMyPatients;
