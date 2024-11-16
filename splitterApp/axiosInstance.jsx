import axios from 'axios';

const token = localStorage.getItem('token'); 

const axiosInstance = axios.create({
  baseURL: 'https://splitter-app.onrender.com/api/auth',

});
// Add interceptor to include the token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosInstance;
