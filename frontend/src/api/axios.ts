import axios from 'axios';

const defaultBackendUrl = 'https://turbo-waddle-7v79v67qjwpw2rr76-8080.app.github.dev';
const baseURL = import.meta.env.VITE_API_BASE_URL || defaultBackendUrl;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
