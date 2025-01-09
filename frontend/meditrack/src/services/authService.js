import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Doctor Registration
export const registerDoctor = async (doctorData) => {
  try {
    const response = await axios.post(`${API_URL}/doctor/register`, doctorData);
    return response.data;
  } catch (error) {
    console.error("Error during doctor registration:", error.response?.data || error.message);
    throw error.response?.data || "Server error";
  }
};

// Patient Registration
export const registerPatient = async (patientData) => {
  try {
    const response = await axios.post(`${API_URL}/patient/register`, patientData);
    return response.data;
  } catch (error) {
    console.error("Error during patient registration:", error.response?.data || error.message);
    throw error.response?.data || "Server error";
  }
};
