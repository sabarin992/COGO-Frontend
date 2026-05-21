import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // for setting token in cookies for every request
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.detail === "User is blocked"
    ) {
      // Clear authentication cookie via server-side logout using a clean, fresh axios request
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

      // Only alert and redirect if the user is not already on the login page
      if (window.location.pathname !== "/login") {
        toast.error("Your account has been blocked by the administrator.");
        window.location.href = "/login";
      }

      // Return a pending promise to cancel downstream chain errors during redirect
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;

