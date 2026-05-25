import { Route } from "react-router-dom";

import AdminProtectedRoute from "../components/AdminProtectedRoute";

import AdminUser from "../pages/admin/AdminUser";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";


const AdminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  {
    path: "/admin/users",
    element: (
      <AdminProtectedRoute>
        <AdminUser />
      </AdminProtectedRoute>
    ),
  },

  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
];

export default AdminRoutes;

