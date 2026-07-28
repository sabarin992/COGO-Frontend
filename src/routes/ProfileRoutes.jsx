import { Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Profile from "../pages/profile/Profile";
import ProfileLayout from "../layouts/ProfileLayout";
import Edit_profile from "../pages/profile/Edit_profile";
import KycDocuments from "../pages/kyc/KYCDocuments";
import AddKycDoc from "../pages/kyc/AddKycDoc";

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
        path: "edit-profile",
        element: <Edit_profile />,
      },
      {
        path: "kyc",
        element: <KycDocuments />,
      },
      {
        path: "add-kyc",
        element: <AddKycDoc />,
      },
    ],
  },
];

export default ProfileRoutes;
