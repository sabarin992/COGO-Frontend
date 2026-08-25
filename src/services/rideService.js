// Dummy route service
// Later this function will call Google Directions API

import api from "../api";

export const getRoutes = async (source, destination) => {
  return [
    {
      id: 1,
      name: "Via NH544",
      distance: "74 km",
      duration: "1 hr 20 min",
    },
    {
      id: 2,
      name: "Via NH66",
      distance: "78 km",
      duration: "1 hr 35 min",
    },
    {
      id: 3,
      name: "Via SH22",
      distance: "82 km",
      duration: "1 hr 40 min",
    },
  ];
};

// Create a new ride
export const createRide = async (rideData) => {
  const response = await api.post("/ride", rideData);
  return response.data;
};

// Get all rides created by the logged-in user
export const getMyRides = async () => {
  const response = await api.get("/ride/my-rides");
  return response.data;
};

// Get a single ride by its ID for rider
export const getRideById = async (rideId) => {
  const response = await api.get(`/ride/${rideId}`);  
  return response.data;
};

// Get complete ride details for passengers
export const getRideDetails = async (rideId) => {
  const response = await api.get(`/ride/${rideId}/details`);
  return response.data;
};

// Update a single ride by its ID
export const updateRide = async (rideId, rideData) => {
  const response = await api.put(`/ride/${rideId}`, rideData);
  return response.data;
};

// Delete a single ride by its ID
export const deleteRide = async (rideId) => {
  const response = await api.delete(`/ride/${rideId}`);
  return response.data;
};

// Search for available rides
export const searchRides = async (searchData) => {
  const response = await api.post("/ride/search", searchData);
  return response.data;
};


// Request a ride
export const requestRide = async (requestData) => {
  const response = await api.post("/ride/request", requestData);
  return response.data;
};

// Get all requests for a ride
export const getRideRequests = async (rideId) => {
  
  
  const response = await api.get(
    `/ride/${rideId}/requests/`
  );
  console.log('hello');

  return response.data;
};


// Get all requests across ALL rides posted by the logged-in user
export const getAllMyRideRequests = async () => {
  const response = await api.get("/ride/my-requests");
  return response.data;
};

// Get details for a specific ride request by ID
export const getSingleRideRequestDetails = async (rideRequestId) => {
  const response = await api.get(`/ride/requests/${rideRequestId}`);
  return response.data;
};

// Accept a ride request
export const acceptRideRequest = async (rideRequestId) => {
  const response = await api.post(
    `/ride/requests/${rideRequestId}/accept`
  );

  return response.data;
};

// Reject a ride request
export const rejectRideRequest = async (rideRequestId) => {
  const response = await api.post(
    `/ride/requests/${rideRequestId}/reject`
  );

  return response.data;
};

// Get all ride requests sent by the logged-in user as a passenger (My Bookings)
export const getMyBookings = async () => {
  const response = await api.get("/ride/my-bookings");
  return response.data;
};

// Cancel a ride request (passenger booking)
export const cancelRideRequest = async (rideRequestId) => {
  const response = await api.post(
    `/ride/requests/${rideRequestId}/cancel`
  );
  return response.data;
};



