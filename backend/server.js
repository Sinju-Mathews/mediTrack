const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const db = require("./config/db");

const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const app = express();

const path = require('path');

// app.use("/uploads", express.static(path.join(__dirname, "backend", "uploads")));
app.use(express.static("./public"));
// Setup session management
app.use(
  session({
    secret: "simple_secret", // Simplified secret (hardcoded for local use)
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // No HTTPS, since it's local-only
      httpOnly: false, // Cookies can be accessed by JavaScript if needed
    },
  })
);

// CORS Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow all origins for local testing

// Middleware
app.use(express.json());

// Unified login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check if email belongs to a doctor
  db.query("SELECT * FROM doctors WHERE email = ?", [email], (err, doctorResults) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (doctorResults.length > 0) {
      bcrypt.compare(password, doctorResults[0].password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: "Error verifying password" });

        if (isMatch) {
          req.session.doctorId = doctorResults[0].id;
          return res.json({ message: "Login successful", role: "doctor", id: doctorResults[0].id });
        } else {
          return res.status(401).json({ message: "Wrong credentials" });
        }
      });
    } else {
      // If not found in doctors, check the patients table
      db.query("SELECT * FROM patients WHERE email = ?", [email], (err, patientResults) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (patientResults.length > 0) {
          bcrypt.compare(password, patientResults[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Error verifying password" });

            if (isMatch) {
              req.session.patientId = patientResults[0].id;
              return res.json({ message: "Login successful", role: "patient", id: patientResults[0].id });
            } else {
              return res.status(401).json({ message: "Wrong credentials" });
            }
          });
        } else {
          return res.status(401).json({ message: "Wrong credentials" });
        }
      });
    }
  });
});

// Check session route
app.get("/api/session", (req, res) => {
  if (req.session.patientId) {
    return res.json({ role: "patient", id: req.session.patientId });
  } else if (req.session.doctorId) {
    return res.json({ role: "doctor", id: req.session.doctorId });
  } else {
    return res.status(401).json({ message: "Not logged in" });
  }
});

// Logout route
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Authentication routes for registration
app.use("/api/doctor", doctorRoutes(db, bcrypt));
app.use("/api/patient", patientRoutes(db, bcrypt));

// Server Setup
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
