import React from "react";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import AdminUser from "../pages/admin/AdminUser";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../layouts/AdminLayout";
import AdminKYCVerification from "../pages/admin/AdminKYCVerification";

const AdminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        path: "users",
        element: <AdminUser />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "kyc",
        element: <AdminKYCVerification />,
      },
    ],
  },
];

export default AdminRoutes;
