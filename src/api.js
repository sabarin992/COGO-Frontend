import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // for setting token in cookies for every request
});

// Variables to handle token refresh queueing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Handle auto-logout if user is blocked (403 Blocked)
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.detail === "User is blocked"
    ) {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "";
        const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        await axios.post(
          `${cleanBaseUrl}/auth/logout`,
          {},
          { withCredentials: true }
        );
      } catch (logoutError) {
        console.error("Auto-logout request failed:", logoutError);
      }

      if (window.location.pathname !== "/login") {
        toast.error("Your account has been blocked by the administrator.");
        window.location.href = "/login";
      }

      return new Promise(() => {});
    }

    // 2. Handle token refresh on 401 Unauthorized
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const baseUrl = import.meta.env.VITE_API_URL || "";
        const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        
        await axios.post(
          `${cleanBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // Refresh failed (refresh token is expired or invalid) -> logout & redirect to login
        try {
          const baseUrl = import.meta.env.VITE_API_URL || "";
          const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
          await axios.post(
            `${cleanBaseUrl}/auth/logout`,
            {},
            { withCredentials: true }
          );
        } catch (logoutError) {
          console.error("Cleanup logout failed:", logoutError);
        }

        if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
          toast.error("Your session has expired. Please log in again.");
          window.location.href = "/login";
        }

        return new Promise(() => {});
      }
    }

    return Promise.reject(error);
  }
);

export default api;
