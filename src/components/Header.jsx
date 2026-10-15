import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";

import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import usePostRide from "../hooks/usePostRide";

const Header = () => {
  // --------------------------------------------------
  // State Management
  // --------------------------------------------------

  // Controls the mobile navigation menu.
  const [open, setOpen] = useState(false);

  // Controls the desktop side drawer.
  const [desktopOpen, setDesktopOpen] = useState(false);

  // Authentication state from the global AuthContext.
  const {
    isAuthenticated: isLoggedIn,
    setIsAuthenticated: setIsLoggedIn,
  } = useAuth();

  // React Router navigation and current route information.
  const navigate = useNavigate();
  const location = useLocation();

  // Shared handler for checking the user's role before posting a ride.
  const { handlePostRideClick } = usePostRide();

  // --------------------------------------------------
  // Navigation Helpers
  // --------------------------------------------------

  // Returns true when the current URL matches the given path.
  const isActive = (path) => location.pathname === path;

  // Navigate to a page and close the mobile menu.
  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
    setDesktopOpen(false);
  };

  // --------------------------------------------------
  // Logout Handler
  // --------------------------------------------------

  const handleLogout = async () => {
    try {
      // Call the backend logout API to clear the authentication session.
      const data = await logout();

      // Update the global authentication state.
      setIsLoggedIn(false);

      // Close both menus and redirect to the login page.
      setOpen(false);
      setDesktopOpen(false);
      navigate("/login", { replace: true });

      toast.success(data?.message || "Logged out successfully");
    } catch (error) {
      // Display an error if the logout request fails.
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Logout failed";

      toast.error(message);
    }
  };

  // --------------------------------------------------
  // Render Header
  // --------------------------------------------------

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          {/* Logo: Navigate to the home page. */}
          <div
            className="text-3xl font-black tracking-tight text-black cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            COGO
          </div>

          {/* Desktop Navigation: Visible on medium screens and larger. */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">

            {/* Navigate to ride search. */}
            <button
              type="button"
              onClick={() => handleNavigation("/ride/search")}
              className={`font-semibold cursor-pointer pb-1 ${
                isActive("/ride/search")
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Find a Ride
            </button>

            {/* Verify the user's role before allowing ride posting. */}
            <button
              type="button"
              onClick={handlePostRideClick}
              className={`font-semibold cursor-pointer pb-1 ${
                isActive("/ride/post-ride")
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Post a Ride
            </button>
          </nav>

          {/* Right Section: Show account actions or Sign In. */}
          {isLoggedIn ? (
            <>
              {/* Mobile hamburger button. */}
              <button
                type="button"
                aria-label="Open mobile menu"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className="flex flex-col gap-1.5 md:hidden cursor-pointer"
              >
                <span className="w-6 h-0.5 bg-black" />
                <span className="w-6 h-0.5 bg-black" />
                <span className="w-6 h-0.5 bg-black" />
              </button>

              {/* Desktop profile and menu actions. */}
              <div className="hidden md:flex items-center gap-6">

                {/* Navigate to the user's profile. */}
                <button
                  type="button"
                  aria-label="Open profile"
                  onClick={() => handleNavigation("/profile")}
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                >
                  <User size={18} />
                </button>

                {/* Open the desktop side drawer. */}
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
            </>
          ) : (
            /* Guests can navigate to the login page. */
            <button
              type="button"
              onClick={() => handleNavigation("/login")}
              className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 transition duration-200 text-sm font-semibold rounded-full cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

        {/* ------------------------------------------------
            Mobile Navigation Menu
            Displayed only for authenticated users.
        -------------------------------------------------- */}
        {open && isLoggedIn && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-5">
            <nav className="flex flex-col gap-5">

              {/* Navigate to ride search. */}
              <button
                type="button"
                onClick={() => handleNavigation("/ride/search")}
                className="text-left text-gray-600 hover:text-black transition"
              >
                Find a Ride
              </button>

              {/* Reuse the shared rider-role validation handler. */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handlePostRideClick();
                }}
                className="text-left text-gray-600 hover:text-black transition"
              >
                Post a Ride
              </button>

              {/* Log out and redirect to the login page. */}
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-semibold transition text-left cursor-pointer"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ------------------------------------------------
          Desktop Side Drawer
          Displayed only when an authenticated user opens it.
      -------------------------------------------------- */}
      {desktopOpen && isLoggedIn && (
        <>
          {/* Backdrop: Clicking outside the drawer closes it. */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300 animate-in fade-in"
            onClick={() => setDesktopOpen(false)}
          />

          {/* Side drawer containing account actions. */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-[100] flex flex-col p-6 animate-in slide-in-from-right duration-300 ease-in-out"
          >
            {/* Drawer header and close button. */}
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

            {/* Logout action at the bottom of the drawer. */}
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

      {/* Spacer: Prevent page content from hiding behind the fixed header. */}
      <div className="h-16" />
    </>
  );
};

export default Header;


