import { Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home";


const UserRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
];

export default UserRoutes;
