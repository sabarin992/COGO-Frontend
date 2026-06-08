import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User } from "lucide-react";

const ProfileHeader = () => {
  const [open, setOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const { isAuthenticated: isLoggedIn, setIsAuthenticated: setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const data = await logout();
      toast.success(data?.message || "Logged out successfully");
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

         
        
            <>
              <div className="hidden md:flex items-center gap-6">
                {/* Hamburger Menu */}
                <button
                  onClick={() => setDesktopOpen(true)}
                  className="flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <span className="w-6 h-0.5 bg-black"></span>
                  <span className="w-6 h-0.5 bg-black"></span>
                  <span className="w-6 h-0.5 bg-black"></span>
                </button>
              </div>
            </>
         
        </div>
      </header>

      {/* Desktop Drawer Panel (Only opens if logged in) */}
      {desktopOpen && (
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

       

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

export default ProfileHeader;
