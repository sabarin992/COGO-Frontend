import api from "../api";

export const getAdminUsers = async (params) => {
  try {
    const response = await api.get("/user/admin-users", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const blockUser = async (userId) => {
  try {
    const response = await api.patch(`/user/admin/block/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unblockUser = async (userId) => {
  try {
    const response = await api.patch(`/user/admin/unblock/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const checkAuth = async () => {
//   try {
//     const response = await api.get("/user/check-auth");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const resetPassword = async (email, password) => {
//   try {
//     const response = await api.post("/user/reset-password", { email, password });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
