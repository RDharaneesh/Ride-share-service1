import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
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
