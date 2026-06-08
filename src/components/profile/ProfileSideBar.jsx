import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/authService";
import { toast } from "react-toastify";
import {
  User,
  ShieldCheck,
  Car,
  Lock,
  Wallet,
  CreditCard,
  History,
  LogOut,
} from "lucide-react";

const ProfileSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated: setIsLoggedIn } = useAuth();

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

  const isActive = (path) => {
    if (path === "/profile") {
      return (
        location.pathname === "/profile" ||
        location.pathname === "/profile/" ||
        location.pathname === "/profile/edit-profile"
      );
    }
    return location.pathname === path;
  };

  const menuItems = [
    {
      name: "Account Overview",
      icon: User,
      path: "/profile",
    },
    {
      name: "KYC Documents",
      icon: ShieldCheck,
      path: "/profile/kyc",
    },
    {
      name: "Vehicles",
      icon: Car,
      path: "/profile/vehicles",
    },
    {
      name: "Password Management",
      icon: Lock,
      path: "/profile/password",
    },
    {
      name: "Wallet",
      icon: Wallet,
      path: "/profile/wallet",
    },
    {
      name: "Payments",
      icon: CreditCard,
      path: "/profile/payments",
    },
    {
      name: "SOS Management",
      icon: "SOS",
      path: "/profile/sos",
    },
    {
      name: "Ride History",
      icon: History,
      path: "/profile/rides",
    },
  ];

  const handleItemClick = (item) => {
    if (item.path === "/profile") {
      navigate(item.path);
    } else {
      toast.info(`${item.name} is coming soon!`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1 transition-all duration-300">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-black text-white shadow-sm font-semibold"
                  : "text-gray-600 hover:text-black hover:bg-gray-100/60"
              }`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">
                {item.icon === "SOS" ? (
                  <span
                    className={`font-black text-[9px] tracking-tight border px-1 py-0.5 rounded leading-none ${
                      active ? "border-white text-white" : "border-gray-500 text-gray-600"
                    }`}
                  >
                    SOS
                  </span>
                ) : (
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      active ? "text-white" : "text-gray-500"
                    }`}
                  />
                )}
              </div>
              <span className="flex-1 text-left">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Separator */}
      <hr className="my-4 border-gray-200" />

      {/* Log Out */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-sm text-[#D9383A] hover:bg-red-50 transition-all duration-200 cursor-pointer group"
      >
        <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">
          <LogOut className="w-4 h-4 text-[#D9383A] transition-transform duration-200" />
        </div>
        <span className="flex-1 text-left">Log Out</span>
      </button>
    </div>
  );
};

export default ProfileSideBar;