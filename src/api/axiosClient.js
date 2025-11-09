import axios from "axios";
import { toast } from "react-toastify";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4500/api",
  timeout: 10000,
  withCredentials: true,
});

export const axiosInstanceWithAuth = axios.create({
  baseURL: "http://localhost:4500/api",
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.message);
    return Promise.reject(error);
  }
);

axiosInstanceWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceWithAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.message);
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);
