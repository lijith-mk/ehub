import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// After deploying to Render, replace this with your Render URL
// e.g. 'https://ehub-backend.onrender.com/api'
// For local dev use your machine IP: 'http://192.168.x.x:5000/api'
const BASE_URL = 'https://ehub-backend-r7eg.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Render free tier can be slow on cold start
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return AsyncStorage.getItem('token')
      .then((token) => {
        if (token) {
          if (!config.headers) {
            config.headers = {};
          }
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      })
      .catch(() => config);
  },
  (error) => Promise.reject(error)
);

export default api;
