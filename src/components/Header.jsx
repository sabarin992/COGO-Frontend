import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Verify authentication status on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await api.get("/user/check-auth");
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      toast.success(response?.data?.message || "Logged out successfully");
      setIsLoggedIn(false);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data || "Logout failed");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          
          {/* Left Logo */}
          <div className="text-3xl font-black tracking-tight text-black">
            COGO
          </div>

          {/* Center Menu */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <a
              href="#"
              className="text-black font-semibold border-b-2 border-black pb-1"
            >
              Find a Ride
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-black transition duration-200 font-semibold"
            >
              Post a Ride
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-black transition duration-200 font-semibold"
            >
              My Rides
            </a>

            {/* Render Logout link ONLY if user is authenticated */}
            {/* {isLoggedIn ? (
              <a
                onClick={handleLogout}
                className="text-gray-600 hover:text-black transition duration-200 font-semibold cursor-pointer"
              >
                Logout
              </a>
            ) : (
              <a
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-black transition duration-200 font-semibold cursor-pointer"
              >
                Login
              </a>
            )} */}
          </nav>

          {/* Right Hamburger / Actions (Only render Hamburger options if user is logged in) */}
          {isLoggedIn ? (
            <>
              {/* Mobile Hamburger (Click to toggle Mobile Menu) */}
              <button
                onClick={() => setOpen(!open)}
                className="flex flex-col gap-1.5 md:hidden cursor-pointer"
              >
                <span className="w-6 h-0.5 bg-black"></span>
                <span className="w-6 h-0.5 bg-black"></span>
                <span className="w-6 h-0.5 bg-black"></span>
              </button>

              {/* Desktop Hamburger (Click to open Drawer Panel) */}
              <button
                onClick={() => setDesktopOpen(true)}
                className="hidden md:flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition-opacity"
              >
                <span className="w-6 h-0.5 bg-black"></span>
                <span className="w-6 h-0.5 bg-black"></span>
                <span className="w-6 h-0.5 bg-black"></span>
              </button>
            </>
          ) : (
            /* Simple login button for non-authenticated guests */
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 transition duration-200 text-sm font-semibold rounded-full cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu (Only visible if logged in and hamburger clicked) */}
        {open && isLoggedIn && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-5">
            <nav className="flex flex-col gap-5">
              <a
                href="#"
                className="text-black font-semibold border-b border-black pb-2"
              >
                Find a Ride
              </a>

              <a href="#" className="text-gray-600 hover:text-black transition">
                Post a Ride
              </a>

              <a href="#" className="text-gray-600 hover:text-black transition">
                My Rides
              </a>

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-semibold transition text-left cursor-pointer"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Desktop Drawer Panel (Only opens if logged in) */}
      {desktopOpen && isLoggedIn && (
        <>
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300 animate-in fade-in"
            onClick={() => setDesktopOpen(false)}
          />

          {/* Drawer Panel content */}
          <aside className="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-[100] flex flex-col p-6 animate-in slide-in-from-right duration-300 ease-in-out">
            
            {/* Header / Cross Button */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <span className="text-2xl font-black tracking-tight text-black">
                COGO
              </span>
              
              <button
                onClick={() => setDesktopOpen(false)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-all cursor-pointer"
                title="Close Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Greeting Section */}
            {/* <div className="py-6 flex items-center gap-4 border-b border-gray-100 mb-6">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                U
              </div>

              <div>
                <p className="text-sm font-semibold text-black leading-none">
                  Welcome back
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Consumer Account
                </p>
              </div>
            </div> */}

            {/* Menu Links */}
            {/* <nav className="flex-1 flex flex-col gap-4">
              <a
                href="#"
                onClick={() => setDesktopOpen(false)}
                className="text-black font-semibold text-base py-2 hover:translate-x-1.5 transition-transform"
              >
                Find a Ride
              </a>

              <a
                href="#"
                onClick={() => setDesktopOpen(false)}
                className="text-gray-600 hover:text-black transition py-2 hover:translate-x-1.5 transition-transform"
              >
                Post a Ride
              </a>

              <a
                href="#"
                onClick={() => setDesktopOpen(false)}
                className="text-gray-600 hover:text-black transition py-2 hover:translate-x-1.5 transition-transform"
              >
                My Rides
              </a>
            </nav> */}

            {/* Red Logout Action Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setDesktopOpen(false);
                  handleLogout();
                }}
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

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
