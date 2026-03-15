import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true, // send cookies to the server
});

export const submitInterest = async (data) => {
  const response = await api.post("/interest", data);
  return response.data;
};

export default api;
