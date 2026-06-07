import { Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Profile from "../pages/profile/Profile";
import ProfileLayout from "../layouts/ProfileLayout";


const ProfileRoutes = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Profile />,
      },
    ],
  },
];

export default ProfileRoutes;