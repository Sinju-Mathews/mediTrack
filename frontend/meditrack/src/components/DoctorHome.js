import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/DoctorNavbar"; // Reusable Navbar
import "../styles/DoctorHome.css";
import Carousel from "react-multi-carousel"; // For carousel
import "react-multi-carousel/lib/styles.css"; // Carousel styles

const DoctorHome = () => {
  const [doctorName, setDoctorName] = useState(""); // State for doctor's name
  const [error, setError] = useState(""); // State for error handling
  const [patients, setPatients] = useState([]); // State for patients

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor/session");
        setDoctorName(response.data.name); // Set doctor's name from the API response
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctor details.");
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor/patients"); // Fetch patients
        setPatients(response.data); // Set patients data
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchDoctorDetails();
    fetchPatients();
  }, []);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="doctor-home">
      {/* Reusable Navbar */}
      <Navbar />

      {/* Top Section */}
      <div className="top-section">
        <div className="left-half">
          <img
            src="/assets/doctor_img.jpg"  // Replace with an appropriate doctor-related image URL
            alt="Doctor"
            className="doctor-image"
          />
        </div>
        <div className="right-half">
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <h1>Welcome, <br/>Dr. {doctorName}!</h1>
              <p className="quote">"Wherever the art of medicine is loved, there is also a love of humanity." – Hippocrates</p>
            </>
          )}
        </div>
      </div>

      {/* My Patients Section */}
      <div className="my-patients-section">
        <h2>My Patients</h2>
        <Carousel responsive={responsive}>
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => window.location.href = `/doctor/individualPatient/${patient.id}`}
            >
              <img src={patient.photo || "/assets/default-avatar.png"} alt={patient.name} className="patient-photo" />
              <h3>{patient.name}</h3>
              <p>{patient.email}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default DoctorHome;
