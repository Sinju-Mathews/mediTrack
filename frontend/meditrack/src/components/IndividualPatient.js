import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./DoctorNavbar";
import '../styles/IndividualPatient.css';

const IndividualPatient = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [patientDetails, setPatientDetails] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [medicalReports, setMedicalReports] = useState([]);
    const [expandedPrescriptions, setExpandedPrescriptions] = useState({});
    const [expandedReports, setExpandedReports] = useState({});

    useEffect(() => {
        if (!patientId) {
            console.error('Invalid patient ID');
            return;
        }
        // Fetch patient details
        axios.get(`http://localhost:5000/api/doctor/patient/${patientId}`)
            .then(response => setPatientDetails(response.data))
            .catch(error => console.error('Error fetching patient details:', error));

        // Fetch prescriptions
        axios.get(`http://localhost:5000/api/doctor/prescriptions/${patientId}`)
            .then(response => setPrescriptions(response.data))
            .catch(error => console.error('Error fetching prescriptions:', error));

        // Fetch medical reports
        axios.get(`http://localhost:5000/api/doctor/medical-reports/${patientId}`)
            .then(response => setMedicalReports(response.data))
            .catch(error => console.error('Error fetching medical reports:', error));
    }, [patientId]);

    const handleDeletePrescription = (id, timestamp) => {
        const currentTime = new Date().getTime();
        const prescriptionTime = new Date(timestamp).getTime();
        if (currentTime - prescriptionTime <= 3600000) { // 1 hour in milliseconds
            axios.delete(`http://localhost:5000/api/doctor/delete-prescription/${id}`)
                .then(() => {
                    setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
                })
                .catch(error => console.error('Error deleting prescription:', error));
        } else {
            alert("You can't delete this prescription anymore.");
        }
    };

    const handleDeleteReport = (id, timestamp) => {
        const currentTime = new Date().getTime();
        const reportTime = new Date(timestamp).getTime();
        if (currentTime - reportTime <= 3600000) { // 1 hour in milliseconds
            axios.delete(`http://localhost:5000/api/doctor/delete-medical-report/${id}`)
                .then(() => {
                    setMedicalReports(medicalReports.filter(report => report.id !== id));
                })
                .catch(error => console.error('Error deleting medical report:', error));
        } else {
            alert("You can't delete this report anymore.");
        }
    };

    const togglePrescriptionDetails = (id) => {
        setExpandedPrescriptions(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const toggleReportDetails = (id) => {
        setExpandedReports(prevState => ({
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
                <h1>{patientDetails.name}</h1>
                <div className="patient-condition">
                    <p><strong>Condition:</strong> {patientDetails.disease ? patientDetails.disease : "Not provided"}</p>
                    {patientDetails.disease ? (
                        <button onClick={() => navigate(`/doctor/edit-condition/${patientId}`)}>Edit Condition</button>
                    ) : (
                        <button onClick={() => navigate(`/doctor/edit-condition/${patientId}`)}>Add Condition</button>
                    )}
                </div>

                <div className="action-buttons">
                    <button onClick={() => navigate(`/doctor/add-prescription/${patientId}`)} className="action-btn">Add Prescription</button>
                    <button onClick={() => navigate(`/doctor/add-medical-report/${patientId}`)} className="action-btn">Add Medical Report</button>
                </div>

                <div className="section">
                    <h2>Previous Prescriptions</h2>
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
                                    <button className="del-btn" onClick={() => handleDeletePrescription(prescription.id, prescription.timestamp)} disabled={new Date().getTime() - new Date(prescription.timestamp).getTime() > 3600000}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : <p>No prescriptions available.</p>}
                </div>

                <div className="section">
                    <h2>Medical Reports</h2>
                    {medicalReports.length > 0 ? (
                        medicalReports.map(report => (
                            <div key={report.id} className="card">
                                <div className="card-header">
                                    <h3>{report.title}</h3>
                                    <p>{new Date(report.timestamp).toLocaleString()}</p>
                                </div>
                                <div className={`card-body ${expandedReports[report.id] ? 'show' : ''}`}>
                                    <p><strong>Medical Report :</strong> <a href={report.filePath} target="_blank" rel="noopener noreferrer">Open Report</a></p>
                                </div>

                                <div className="card-footer">
                                    <button className="view-btn" onClick={() => toggleReportDetails(report.id)}>
                                        {expandedReports[report.id] ? "Collapse" : "View More"}
                                    </button>
                                    <button className="del-btn" onClick={() => handleDeleteReport(report.id, report.timestamp)} disabled={new Date().getTime() - new Date(report.timestamp).getTime() > 3600000}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : <p>No medical reports available.</p>}
                </div>
            </div>
        </div>
    );
};

export default IndividualPatient;
