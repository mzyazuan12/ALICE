// src/lib/apiClient.ts

import axios from 'axios';

// Replace with your API base URL
const BASE_URL = "https://your-api-url.com"; 

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add any additional headers if necessary, e.g., Authorization
  },
});

// Optionally, you can configure interceptors for handling requests and responses globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally here
    return Promise.reject(error);
  }
);

export default apiClient;
