// src/utils/axiosInstance.ts
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT, // Replace with your actual API endpoint
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return the response as is
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      // Handle 401 Unauthorized
      localStorage.removeItem('token'); // Remove the token from local storage
      toast.error("Session expired. Please log in again."); // Show notification
      // Redirect to the login page
      window.location.href = '/'; // Adjust the path as necessary
    }
    return Promise.reject(error); // Return the error for further handling
  }
);

export default axiosInstance;
