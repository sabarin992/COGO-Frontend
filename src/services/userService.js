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

export const editUserProfile = async (full_name,phone) => {
  try {
    const response = await api.put("/user/edit-profile", {
        full_name,
        phone,
      });
    return response.data;
  } catch (error) {
    throw error;
  }
};


