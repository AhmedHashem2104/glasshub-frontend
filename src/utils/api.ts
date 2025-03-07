import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/certificates", // Adjust the URL based on your backend
});

export default api;
