import { Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import OtpVerification from "../pages/auth/OtpVerification";
import ResetPassword from "../pages/auth/ResetPassword";

import PublicRoute from "../components/PublicRoute";


const AuthRoutes = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/otp-verification",
    element: <OtpVerification />,
  },

  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
];

export default AuthRoutes;

