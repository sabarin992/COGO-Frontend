import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OtpVerification from "./pages/auth/OtpVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Profile from "./pages/profile/Profile";
import Edit_profile from "./pages/profile/Edit_profile";
import AdminUser from "./pages/admin/AdminUser";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <>
      {/*toast container*/}
      <ToastContainer />

      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <Edit_profile/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <AdminProtectedRoute>
              <AdminUser/>
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
