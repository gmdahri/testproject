import axios from "axios";
export default axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
})
