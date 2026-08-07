import api from "../api";

/**
 * Create Vehicle
 */
export const createVehicle = async (formData) => {
  const response = await api.post("/vehicles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/**
 * Get Logged-in User Vehicles
 */
export const getVehicles = async () => {
  const response = await api.get("/vehicles");
  return response?.data;
};

/**
 * Get Single Vehicle by ID
 */
export const getVehicleById = async (vehicleId) => {
  const response = await api.get(`/vehicles/${vehicleId}`);
  return response.data;
};

/**
 * Update Vehicle
 */
export const updateVehicle = async (vehicleId, formData) => {
  const response = await api.put(`/vehicles/${vehicleId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/**
 * Delete Vehicle
 */
export const deleteVehicle = async (vehicleId) => {
  const response = await api.delete(`/vehicles/${vehicleId}`);
  return response;
};
