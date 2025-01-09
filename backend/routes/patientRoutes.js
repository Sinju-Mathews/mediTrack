const express = require("express");
const { registerPatient, doctorDetails, getPatientBySession, viewMedicalReports, viewPrescriptions, updatePatientProfile, upload } = require("../controllers/patientController");
const router = express.Router();

module.exports = (db, bcrypt) => {
  // Route for patient registration
  router.post("/register", (req, res) => registerPatient(req, res, db, bcrypt));

  // Route for fetching patient details from session (no need for patient ID in URL)
  router.get("/session", (req, res) => getPatientBySession(req, res, db));
  router.get("/myprescriptions", (req, res) => viewPrescriptions(req, res, db));
  router.get("/myreports", (req, res) => viewMedicalReports(req, res, db));
  router.get("/doctor-details", (req, res) => doctorDetails(req, res, db));


  // Route for updating patient profile (with photo upload if provided)
  router.put("/update", upload.single("photo"), (req, res) => updatePatientProfile(req, res, db));

  return router;
};
