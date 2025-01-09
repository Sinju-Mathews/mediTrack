import React from "react";
import axios from "axios"; // Import Axios
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DoctorRegistration from "./components/DoctorRegistration";
import PatientRegistration from "./components/PatientRegistration";
import DoctorHome from "./components/DoctorHome";
import PatientHome from "./components/PatientHome";
import PatientProfile from "./components/PatientProfile";
import PatientUpdate from "./components/PatientUpdate"; // Import the new PatientUpdate component
import DoctorProfile from "./components/DoctorProfile";
import DoctorUpdate from "./components/DoctorUpdate"; 
import DoctorMyPatients from "./components/DoctorMyPatients"; 
import IndividualPatient from "./components/IndividualPatient"; 
import EditCondition from "./components/EditCondition"; 
import AddPrescription from "./components/AddPrescription"; 
import AddMedicalReport from "./components/AddMedicalReport"; 
import MyPrescription from "./components/MyPrescription"; 
import MyReports from "./components/MyReports"; 
// Enable credentials for all Axios requests
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register/doctor" element={<DoctorRegistration />} />
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route path="/doctor/home" element={<DoctorHome />} />
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/profile" element={<PatientProfile />} /> {/* Patient profile view */}
        <Route path="/patient/update" element={<PatientUpdate />} /> 
        <Route path="/doctor/profile" element={<DoctorProfile />} /> {/* Patient profile view */}
        <Route path="/doctor/update" element={<DoctorUpdate />} />{/* Patient update page */}
        <Route path="/doctor/mypatients" element={<DoctorMyPatients />} />{/* Patient update page */}
        <Route path="/doctor/individualPatient/:patientId" element={<IndividualPatient />} />
        <Route path="/doctor/edit-condition/:patientId" element={<EditCondition />} />
        <Route path="/doctor/add-prescription/:patientId" element={<AddPrescription />} />
        <Route path="/doctor/add-medical-report/:patientId" element={<AddMedicalReport />} />
        <Route path="/patient/MyPrescriptions" element={<MyPrescription />} />
        <Route path="/patient/medicalreports" element={<MyReports />} />
      </Routes>
    </Router>
  );
};

export default App;
