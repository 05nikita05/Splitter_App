import axios from 'axios';

// Dynamically set the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://splitter-app.onrender.com/api/' // Production URL
  : 'http://localhost:5000/api/'; // Development URL

const axiosInstance = axios.create({
  baseURL, // Use the dynamically set base URL
});

// Add interceptor to include the token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add Authorization header if token exists
  }
  return config;
});

export default axiosInstance;
