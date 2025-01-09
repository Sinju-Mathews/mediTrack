const db = require("../config/db");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

// Set up multer for file upload (optional if you want to handle profile photos)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads/");  // specify your uploads directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });


const PATH = "./public/uploads";
const upload = multer({
  storage: multer.diskStorage({
    destination: PATH,
    filename: function (req, file, cb) {
      let origialname = file.originalname;
      let ext = origialname.split(".").pop();
      let filename = origialname.split(".").slice(0, -1).join(".");
      cb(null, filename + "." + ext);
    },
  }),
});


// Register a new patient
const registerPatient = async (req, res) => {
  const { name, email, password, dob, gender } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into patients table
    const query = `
      INSERT INTO patients (name, email, password, dob, gender)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [name, email, hashedPassword, dob, gender], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error registering patient" });
      }
      res.status(201).json({ message: "Patient registered successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get patient details based on session data (no need for `id` in URL)
const getPatientBySession = (req, res) => {
  const patientId = req.session.patientId;  // Get patientId from session

  if (!patientId) {
    return res.status(401).json({ message: "You are not logged in." }); // If session is not set
  }

  const query = `
    SELECT id, name, email, dob, gender, phone, address, disease, photo
    FROM patients
    WHERE id = ?
  `;

  db.query(query, [patientId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching patient details" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(rows[0]);  // Return the first row (patient details)
  });
};


const doctorDetails = (req, res) => {

  const query = `
    SELECT id, name, email,  phone, clinic_name, clinic_address, specialization, photo
    FROM doctors
     `;

  db.query(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching patient details" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(rows[0]);  // Return the first row (patient details)
  });
};

// Update patient profile
const updatePatientProfile = async (req, res) => {
  const patientId = req.session.patientId; // Assuming patientId is stored in session

  if (!patientId) {
    return res.status(401).json({ message: "You are not logged in." });
  }

  const { name, email, dob, gender, phone, address } = req.body;
console.log(req.body);

  // var fileValue = JSON.parse(JSON.stringify(req.files));
  // var profileimgsrc = `http://127.0.0.1:${port}/images/${fileValue.user_photo[0].filename}`;

  const photo = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

  // Prepare the query for updating patient details
  const query = `
    UPDATE patients
    SET name = ?, email = ?, dob = ?, gender = ?, phone = ?, address = ?, photo = ?
    WHERE id = ?
  `;

  db.query(query, [name, email, dob, gender, phone, address, photo, patientId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating profile" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  });
};

// Controller to view prescriptions for a patient
const viewPrescriptions = (req, res) => {
  const patientId = req.session.patientId; 
  const query = `
    SELECT id, title, timestamp, contents
    FROM prescriptions
    WHERE patientId = ?
    ORDER BY timestamp DESC
  `;

  db.query(query, [patientId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching prescriptions" });
    }
    res.json(rows);
  });
};

const viewMedicalReports = (req, res) => {
  const patientId = req.session.patientId; 
  const query = `
    SELECT id, title, timestamp, filePath
    FROM medicalreports
    WHERE patientId = ?
  `;

  db.query(query, [patientId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching medical reports" });
    }

    res.json(rows);
  });
};

module.exports = { registerPatient,doctorDetails, getPatientBySession,viewMedicalReports,viewPrescriptions, updatePatientProfile, upload };
