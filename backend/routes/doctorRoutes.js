const express = require("express");
const {registerDoctor, getDoctorBySession, fetchPatients, updateDoctorProfile, updatePatientCondition,upload, report,
  insertPrescription, deletePrescription,  viewPrescriptions, insertMedicalReport, deleteMedicalReport, viewMedicalReports, 
  fetchPatient
} = require("../controllers/doctorController");
const router = express.Router();

module.exports = (db, bcrypt) => {
  // Route for doctor registration
  router.post("/register", (req, res) => registerDoctor(req, res, db, bcrypt));
  // Route for fetching doctor details from session (no need for doctor ID in URL)
  router.get("/session", (req, res) => getDoctorBySession(req, res, db));
  // Route for updating doctor profile (with photo upload if provided)
  router.put("/update", upload.single("photo"), (req, res) => updateDoctorProfile(req, res, db));
  // Define the route to fetch all patients
  router.get("/patients", (req, res) => fetchPatients(req, res, db));
  router.get("/patient/:patientId", (req, res) => fetchPatient(req, res, db));
  router.put("/patient/:patientId/condition",(req, res) => updatePatientCondition(req, res, db));
  // Route to insert a prescription
  router.post("/prescription", (req, res) => insertPrescription(req, res, db));
  router.delete("/delete-prescription/:id", (req, res) => deletePrescription(req, res, db));
  // Route to view prescriptions for a specific patient
  router.get("/prescriptions/:patientId", (req, res) => viewPrescriptions(req, res, db));
  // Route to insert a medical report
  router.post('/medical-report', report.single('file'), (req, res) => insertMedicalReport(req, res, db));
  router.delete('/delete-medical-report/:id', (req, res) => deleteMedicalReport(req, res, db));
  // Route to view medical reports for a specific patient
  router.get("/medical-reports/:patientId", (req, res) => viewMedicalReports(req, res, db));
  return router;
};
