const db = require("../config/db");
const bcrypt = require("bcrypt");
const { log } = require("console");
const multer = require("multer");
const path = require("path");


const PATH = "./public/uploads";


const report = multer({
  storage: multer.diskStorage({
    destination: PATH, // Set the destination for file uploads
    filename: function (req, file, cb) {
      const originalname = file.originalname;
      const ext = originalname.split('.').pop();
      const reportfile = originalname.split('.').slice(0, -1).join('.');
      cb(null, reportfile + '.' + ext); // Use the original file name with extension
    },
  }),
});

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

const registerDoctor = async (req, res) => {
  const { name, email, password, specialization, clinicName } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into doctors table
    const query = `
      INSERT INTO doctors (name, email, password, specialization, clinic_name)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [name, email, hashedPassword, specialization, clinicName],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error registering doctor" });
        }
        res.status(201).json({ message: "Doctor registered successfully" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



const getDoctorBySession = (req, res) => {
  const doctorId = req.session.doctorId;  // Get doctorId from session

  if (!doctorId) {
    return res.status(401).json({ message: "You are not logged in." }); // If session is not set
  }

  const query = `
    SELECT id, name, email, specialization, phone, clinic_name, clinic_address, photo
    FROM doctors
    WHERE id = ?
  `;

  db.query(query, [doctorId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching doctor details" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(rows[0]);  // Return the first row (doctor details)
  });
};


// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  const doctorId = req.session.doctorId; // Assuming doctorId is stored in session

  if (!doctorId) {
    return res.status(401).json({ message: "You are not logged in." });
  }

  const { name, email, specialization, phone, clinic_name, clinic_address } = req.body;
  const photo = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

  // Prepare the query for updating doctor details
  const query = `
    UPDATE doctors
    SET name = ?, email = ?,specialization = ?,  phone = ?, clinic_name = ?,  clinic_address = ?, photo = ?
    WHERE id = ?
  `;

  db.query(query, [name, email, specialization, phone, clinic_name, clinic_address, photo, doctorId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating profile" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  });
};

// Controller to fetch all patients
const fetchPatients = (req, res) => {
  const query = `
    SELECT id, name, email, phone, dob, photo, gender, disease
    FROM patients
  `;

  db.query(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching patients" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.json(rows); // Return all patient details
  });
};

const fetchPatient = (req, res) => {
  const { patientId } = req.params;
  const query = `
    SELECT id, name, email, phone, dob, photo, gender, disease
    FROM patients WHERE id = ?
  `;
  db.query(query, [patientId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching patient details" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(rows[0]); // Return the patient details
  });
};


  const updatePatientCondition = (req, res) => {
  const { patientId } = req.params; // Extract patientId from request parameters
  const { disease } = req.body;  // Extract the new condition from the request body

  if (!disease || disease.trim() === "") {
    return res.status(400).json({ message: "Condition cannot be empty" });
  }

  // SQL query to update the patient's condition
  const query = `
    UPDATE patients
    SET disease = ?
    WHERE id = ?
  `;

  db.query(query, [disease, patientId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating patient condition" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient condition updated successfully" });
  });
};

const insertPrescription = (req, res) => {
  const { patientId, title, contents } = req.body;
  const timestamp = new Date();
  const query = `
    INSERT INTO prescriptions (patientId, title, timestamp, contents)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [patientId, title, timestamp, contents], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error inserting prescription" });
    }

    res.status(201).json({ message: "Prescription added successfully" });
  });
};

// Controller to view prescriptions for a patient
const viewPrescriptions = (req, res) => {
  const { patientId } = req.params;
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


const deletePrescription = (req, res) => {
  const { id } = req.params;
  const query = `
    Delete 
    FROM prescriptions
    WHERE id = ?
  `;

  db.query(query, [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting prescription" });
    }
    res.status(201).json({ message: "deleted successfully" });
  });
};

// Controller to insert a medical report
const insertMedicalReport = (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const { patientId, title } = req.body;
  const timestamp = new Date();
  const filepath = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

  console.log('Filepath:', filepath);  // Ensure the file path is correctly formed

  const query = `
    INSERT INTO medicalreports (patientId, title, timestamp, filePath)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [patientId, title, timestamp, filepath], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error inserting medical report" });
    }

    res.status(201).json({ message: "Medical report added successfully" });
  });
};

const deleteMedicalReport = (req, res) => {
  const { id } = req.params;
  const query = `
    Delete 
    FROM medicalreports
    WHERE id = ?
  `;

  db.query(query, [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting medicalreports" });
    }
    res.status(201).json({ message: "deleted successfully" });
  });
};

// Controller to view medical reports for a patient
const viewMedicalReports = (req, res) => {
  const { patientId } = req.params;
  const query = `
    SELECT id, title, timestamp, filePath
    FROM medicalreports
    WHERE patientId = ?
    ORDER BY timestamp DESC
  `;

  db.query(query, [patientId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching medical reports" });
    }

    res.json(rows);
  });
};

module.exports = { 
  registerDoctor, 
  getDoctorBySession, 
  fetchPatients, 
  fetchPatient,
  updateDoctorProfile, 
  updatePatientCondition,
  upload, 
  report,
  insertPrescription, 
  deletePrescription,
  viewPrescriptions, 
  insertMedicalReport, 
  deleteMedicalReport,
  viewMedicalReports 
};
