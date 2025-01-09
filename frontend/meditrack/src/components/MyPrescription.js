import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./PatientNavbar";
import '../styles/IndividualPatient.css';

const MyPrescription = () => {
   

    const [patientDetails, setPatientDetails] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [expandedPrescriptions, setExpandedPrescriptions] = useState({});

    useEffect(() => {
        
        // Fetch patient details
        axios.get(`http://localhost:5000/api/patient/session`)
            .then(response => setPatientDetails(response.data))
            .catch(error => console.error('Error fetching patient details:', error));

        // Fetch prescriptions
        axios.get(`http://localhost:5000/api/patient/myprescriptions/`)
            .then(response => setPrescriptions(response.data))
            .catch(error => console.error('Error fetching prescriptions:', error));
    },);

    const togglePrescriptionDetails = (id) => {
        setExpandedPrescriptions(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    if (!patientDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Navbar />

            <div className="individual-patient-container">
                <h1>My Prescriptions</h1>
                <div className="patient-condition">
                    <p><strong>Condition:</strong> {patientDetails.disease ? patientDetails.disease : "Not provided"}</p>
                </div>

                <div className="section">
                    <h2>Prescriptions</h2>
                    {prescriptions.length > 0 ? (
                        prescriptions.map(prescription => (
                            <div key={prescription.id} className="card">
                                <div className="card-header">
                                    <h3>{prescription.title}</h3>
                                    <p>{new Date(prescription.timestamp).toLocaleString()}</p>
                                </div>
                                <div className={`card-body ${expandedPrescriptions[prescription.id] ? 'show' : ''}`}>
                                    <p><strong>Description:</strong> {prescription.contents}</p>
                                </div>
                                <div className="card-footer">
                                    <button className="view-btn" onClick={() => togglePrescriptionDetails(prescription.id)}>
                                        {expandedPrescriptions[prescription.id] ? "Collapse" : "View More"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : <p>No prescriptions available.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyPrescription;
