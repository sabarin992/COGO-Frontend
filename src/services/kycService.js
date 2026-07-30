import api from "../api";

export const getAdminKycList = async ({ search, status, page = 1, size = 10 } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (status && status !== "All") params.status = status.toLowerCase();
  params.page = page;
  params.size = size;

  const response = await api.get("/kyc/admin/kyc-list", { params });
  return response.data;
};

export const approveKyc = async (kycId) => {
  const response = await api.patch(`/kyc/admin/approve/${kycId}`);
  return response.data;
};

export const rejectKyc = async (kycId, reason) => {
  const response = await api.patch(`/kyc/admin/reject/${kycId}`, { reason });
  return response.data;
};
