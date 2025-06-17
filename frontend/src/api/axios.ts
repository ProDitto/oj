import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://turbo-waddle-7v79v67qjwpw2rr76-8080.app.github.dev',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
