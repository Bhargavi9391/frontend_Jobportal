import axios from "axios";

const API_BASE = "https://jobportal-backend-xoym.onrender.com";

// Admin requests
export const adminAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`
  }
});

// User requests
export const userAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`
  }
});
