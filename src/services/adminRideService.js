import api from "../api";

export const getAdminRides = async ({
  search,
  status,
  page = 1,
  size = 10,
} = {}) => {
  try {
    const params = { page, size };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    if (status && status !== "All") {
      params.status = status;
    }

    const response = await api.get("/admin/rides", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminRideStats = async () => {
  try {
    const response = await api.get("/admin/rides/statistics");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminRideDetails = async (rideId) => {
  try {
    const response = await api.get(`/admin/rides/${rideId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelAdminRide = async (rideId, reason) => {
  try {
    const response = await api.post(`/admin/rides/${rideId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

