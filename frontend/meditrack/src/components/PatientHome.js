import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/PatientNavbar"; // Reusable Navbar
import "../styles/PatientHome.css";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp icon

const PatientHome = () => {
  const [patientName, setPatientName] = useState(""); // State for patient's name
  const [doctorDetails, setDoctorDetails] = useState({}); // State for doctor's details
  const [error, setError] = useState(""); // State for error handling

  // Fetch patient details
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patient/session");
        setPatientName(response.data.name);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch patient details.");
      }
    };

    fetchPatientDetails();
  }, []);

  // Fetch doctor's details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patient/doctor-details");
        setDoctorDetails(response.data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      }
    };

    fetchDoctorDetails();
  }, []);

  return (
    <div className="patient-home-page">
      {/* Reusable Navbar */}
      <Navbar />

      {/* Top Section */}
      <div className="patient-top-section">
        <div className="patient-left-section">
          <img
            src="/assets/patient_img.jpg"
            alt="Patient"
            className="patient-image"
          />
        </div>
        <div className="patient-right-section">
          {error ? (
            <p className="patient-error-message">{error}</p>
          ) : (
            <div className="patient-welcome-message">
              <h1 className="patient-title">Welcome, <br />{patientName}!</h1>
              <p className="patient-quote">
                "Hope is the heartbeat of the soul and the light that leads you through the darkest days."
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Details Section */}
      <div className="doctor-details-section">
        <h2 className="doctor-details-title">Your Doctor</h2>
        {doctorDetails.name ? (
          <div className="doctor-details-card">
            {/* Doctor's Photo */}
            <img
              src={doctorDetails.photo || "/assets/default-doctor.jpg"}
              alt="Doctor"
              className="doctor-photo"
            />

            {/* Left and Right Info */}
            <div className="doctor-info-left">
              <p><strong>Name:</strong> {doctorDetails.name}</p>
              <p><strong>Email:</strong> {doctorDetails.email || "Not available"}</p>
              <p><strong>Specialization:</strong> {doctorDetails.specialization}</p>
            </div>

            <div className="doctor-info-right">
              <p><strong>Clinic Name:</strong> {doctorDetails.clinic_name || "N/A"}</p>
              <p><strong>Clinic Address:</strong> {doctorDetails.clinic_address || "N/A"}</p>
              <p><strong>Phone:</strong> {doctorDetails.phone || "Not available"}</p>
              {doctorDetails.phone && (
                <a
                
                  href={`https://wa.me/+919947177369?text=Hi%2C%20I'm%20${patientName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-contact"
                >
                  <FaWhatsapp className="whatsapp-icon" /> Contact Now
                </a>
              )}
            </div>
          </div>
        ) : (
          <p>Doctor details are not available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default PatientHome;
