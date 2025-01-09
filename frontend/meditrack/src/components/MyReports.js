import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./PatientNavbar";
import '../styles/IndividualPatient.css';

const MyReports = () => {
    const [patientDetails, setPatientDetails] = useState(null);
    const [records, setRecords] = useState([]);
    const [expandedRecords, setExpandedRecords] = useState({});

    useEffect(() => {
        // Fetch patient details
        axios.get(`http://localhost:5000/api/patient/session`)
            .then(response => setPatientDetails(response.data))
            .catch(error => console.error('Error fetching patient details:', error));

        // Fetch records
        axios.get(`http://localhost:5000/api/patient/myreports/`)
            .then(response => setRecords(response.data))
            .catch(error => console.error('Error fetching records:', error));
    }, []);

    const toggleRecordDetails = (id) => {
        setExpandedRecords(prevState => ({
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
                <h1>My Medical reports</h1>
                <div className="patient-condition">
                    <p><strong>Condition:</strong> {patientDetails.disease ? patientDetails.disease : "Not provided"}</p>
                </div>

                <div className="section">
                    <h2>Medical reports</h2>
                    {records.length > 0 ? (
                        records.map(record => (
                            <div key={record.id} className="card">
                                <div className="card-header">
                                    <h3>{record.title}</h3>
                                    <p>{new Date(record.timestamp).toLocaleString()}</p>
                                </div>
                                <div className={`card-body ${expandedRecords[record.id] ? 'show' : ''}`}>
                                    <p><strong>Medical Report :</strong> <a href={record.filePath} target="_blank" rel="noopener noreferrer">Open Report</a></p>
                                </div>
                                <div className="card-footer">
                                    <button className="view-btn" onClick={() => toggleRecordDetails(record.id)}>
                                        {expandedRecords[record.id] ? "Collapse" : "View More"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : <p>No records available.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyReports;
