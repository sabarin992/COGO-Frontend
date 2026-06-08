import { Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Profile from "../pages/profile/Profile";
import ProfileLayout from "../layouts/ProfileLayout";
import Edit_profile from "../pages/profile/Edit_profile";


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
      {
        path:"edit-profile",
        element:<Edit_profile/>
      }
    ],
  },
];

export default ProfileRoutes;