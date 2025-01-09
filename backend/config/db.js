const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "meditrack",
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return; 
  } else {
    console.log("Connected to the database successfully!");
  }
});

module.exports = db;
