import axios from 'axios';

// Resolve baseURL in this order:
// 1) runtime override in public/env.js -> window.__ENV.REACT_APP_API_URL
// 2) build-time env var -> process.env.REACT_APP_API_URL
// 3) fallback to localhost
const runtimeEnv = typeof window !== 'undefined' && window.__ENV && window.__ENV.REACT_APP_API_URL;
const baseURL = runtimeEnv || process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Log the effective base URL to help debug which value is used at runtime
/* eslint-disable no-console */
console.log('API baseURL =', baseURL);
/* eslint-enable no-console */

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Example usage with fetch:
// fetch(url, { headers: { ...getAuthHeader(), ...otherHeaders } })

// Example usage with axios:
// axios.get(url, { headers: getAuthHeader() })

export default API;
