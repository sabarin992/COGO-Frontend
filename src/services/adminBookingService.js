import api from "../api";

export const getAdminBookings = async ({
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

    const response = await api.get("/admin/bookings", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminBookingStatistics = async () => {
  try {
    const response = await api.get("/admin/bookings/statistics");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelAdminBooking = async (bookingId, reason) => {
  try {
    const response = await api.post(`/admin/bookings/${bookingId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

