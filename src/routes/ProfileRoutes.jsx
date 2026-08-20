import { Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Profile from "../pages/profile/Profile";
import ProfileLayout from "../layouts/ProfileLayout";
import Edit_profile from "../pages/profile/Edit_profile";
import KycDocuments from "../pages/kyc/KYCDocuments";
import AddKycDoc from "../pages/kyc/AddKycDoc";
import MyRides from "../pages/ride/MyRides";
import RideRequests from "../pages/ride/RideRequests";
import RideRequestDetails from "../pages/ride/RideRequestDetails";
import MyBookings from "../pages/ride/MyBookings";
import MyBookingDetails from "../pages/ride/MyBookingDetails";

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
      {
        path: "my-rides",
        element: <MyRides />,
      },
      {
        path: "ride-requests",
        element: <RideRequests />,
      },
      {
        path: "ride-requests/:requestId",
        element: <RideRequestDetails />,
      },
      {
        path: "my-bookings",
        element: <MyBookings />,
      },
      {
        path: "my-bookings/:requestId",
        element: <MyBookingDetails />,
      },
    ],
  },
];

export default ProfileRoutes;
