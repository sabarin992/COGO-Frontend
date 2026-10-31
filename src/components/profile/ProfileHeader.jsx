import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { logout } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import usePostRide from "../../hooks/usePostRide";

const ProfileHeader = () => {
  // --------------------------------------------------
  // State Management
  // --------------------------------------------------

  // Controls the desktop navigation drawer.
  const [desktopOpen, setDesktopOpen] = useState(false);

  // Get authentication state and its updater from AuthContext.
  const { isAuthenticated: isLoggedIn, setIsAuthenticated: setIsLoggedIn } =
    useAuth();

  // React Router navigation.
  const navigate = useNavigate();

  // Shared handler that verifies the user's role before posting a ride.
  const { handlePostRideClick } = usePostRide();

  // --------------------------------------------------
  // Navigation Handler
  // --------------------------------------------------

  // Navigate to the selected page and close the drawer.
  const handleNavigation = (path) => {
    navigate(path);
    setDesktopOpen(false);
  };

  // --------------------------------------------------
  // Logout Handler
  // --------------------------------------------------

  const handleLogout = async () => {
    try {
      // Send the logout request to the backend.
      const data = await logout();

      // Update authentication state after successful logout.
      setIsLoggedIn(false);
      setDesktopOpen(false);

      // Redirect the user to the login page.
      navigate("/login", { replace: true });

      toast.success(data?.message || "Logged out successfully");
    } catch (error) {
      // Show an appropriate error if logout fails.
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Logout failed";

      toast.error(message);
    }
  };

  // --------------------------------------------------
  // Render Profile Header
  // --------------------------------------------------

  return (
    <>
      {/* Main fixed navigation header. */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo: Navigate to the home page. */}
          <div
            className="text-3xl font-black tracking-tight text-black cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            COGO
          </div>

          {/* Primary navigation links: hidden on mobile. */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            {/* Navigate to the ride search page. */}
            <button
              type="button"
              onClick={() => handleNavigation("/ride/search")}
              className="font-semibold cursor-pointer pb-1 text-gray-600 hover:text-black"
            >
              Find a Ride
            </button>

            {/* Reuse shared rider-role validation before navigation. */}
            <button
              type="button"
              onClick={() => {
                setDesktopOpen(false);
                handlePostRideClick();
              }}
              className="font-semibold cursor-pointer pb-1 text-gray-600 hover:text-black"
            >
              Post a Ride
            </button>
          </nav>

          {/* Navigation menu button: visible on all screen sizes. */}
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={desktopOpen}
              onClick={() => setDesktopOpen(true)}
              className="flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition-opacity"
            >
              <span className="w-6 h-0.5 bg-black" />
              <span className="w-6 h-0.5 bg-black" />
              <span className="w-6 h-0.5 bg-black" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------
          Desktop Side Drawer
          Opens when the hamburger button is clicked.
      -------------------------------------------------- */}
      {desktopOpen && (
        <>
          {/* Backdrop: Clicking outside the drawer closes it. */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300 animate-in fade-in"
            onClick={() => setDesktopOpen(false)}
          />

          {/* Drawer panel containing navigation and account actions. */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-[100] flex flex-col p-6 animate-in slide-in-from-right duration-300 ease-in-out"
          >
            {/* Drawer heading and close button. */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <span className="text-2xl font-black tracking-tight text-black">
                COGO
              </span>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setDesktopOpen(false)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-all cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Logout action positioned at the bottom of the drawer. */}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Spacer: Prevent content from hiding behind the fixed header. */}
      <div className="h-16" />
    </>
  );
};

export default ProfileHeader;
