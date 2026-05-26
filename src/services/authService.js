import api from "../api";

export const adminLogin = async (email, password) => {
  try {
    const response = await api.post("/auth/admin/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginGoogle = async (token) => {
  try {
    const response = await api.post("/auth/google", { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (payload) => {
  try {
    const response = await api.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await api.post("/otp/send-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/otp/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await api.post("/otp/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, password) => {
  try {
    const response = await api.post("/user/reset-password", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/user/check-auth");
    return response.data;
  } catch (error) {
    throw error;
  }
};