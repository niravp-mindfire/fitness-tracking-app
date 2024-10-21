// src/utils/axiosInstance.ts
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Send a request to the refresh token endpoint
    const response = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/auth/refresh`,
      { refreshToken },
    );
    const { token } = response.data; // Assuming the new access token is returned as 'token'

    // Save the new token to localStorage
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

// Request interceptor to include the token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  },
);

// Response interceptor to handle 401 errors (token expiration)
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response as is for successful requests
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    // Check if the error is a 401 and the token has expired
    if (response && response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops

      try {
        // Attempt to refresh the token
        const newAccessToken = await refreshAccessToken();
        // Update the Authorization header with the new token and retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Retry the original request with new token
      } catch (refreshError) {
        // If refreshing the token fails (e.g., refresh token expired), log the user out
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Return the error if it's not a token issue or refresh fails
  },
);

export default axiosInstance;
