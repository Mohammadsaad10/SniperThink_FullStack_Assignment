import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:5000/api" : "/api"),
  timeout: 15000,
});

export const submitInterest = async (data) => {
  const response = await api.post("/interest", data);
  return response.data;
};

export default api;
