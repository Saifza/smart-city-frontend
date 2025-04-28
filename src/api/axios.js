import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090', // Your API Gateway base
});

export default api;
