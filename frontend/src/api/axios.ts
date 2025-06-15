import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://glowing-giggle-74gwwvrxpxg2rj56-8080.app.github.dev',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
