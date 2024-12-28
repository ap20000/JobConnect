import axios from 'axios';

// You can modify this URL to your backend server
const instance = axios.create({
  baseURL: 'http://localhost:3001',  // Replace with your API base URL
});

export default instance;
