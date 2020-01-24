import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT,
});

export default axiosInstance;
