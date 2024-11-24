import axios from 'axios';

// Dynamically set the base URL based on the environment
const baseURL = import.meta.env.NODE_ENV === 'Development'
  ?'http://localhost:5000/api/' // Development URL
  : import.meta.env.VITE_BACKEND_URL ;// Production URL

const axiosInstance = axios.create({
  baseURL, // Use the dynamically set base URL
  withCredentials: true,

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
