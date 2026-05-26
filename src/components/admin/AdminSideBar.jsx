import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Bike, 
  Calendar, 
  AlertTriangle, 
  BarChart3,
  LogOut
} from "lucide-react";
import { logout } from "../../services/authService";
import { toast } from "react-toastify";

const AdminSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: "group",
      label: "Users",
      path: "/admin/users",
    },
    {
      icon: "verified_user",
      label: "KYC Verification",
      path: "/admin/kyc",
    },
    {
      icon: "moped",
      label: "Riders",
      path: "/admin/riders",
    },
    {
      icon: "event_note",
      label: "Bookings",
      path: "/admin/bookings",
    },
    {
      icon: "warning",
      label: "SOS Management",
      path: "/admin/sos",
    },
    {
      icon: "bar_chart",
      label: "Sales Reports",
      path: "/admin/sales",
    },
  ];

  // Map icons to Lucide components
  const iconMap = {
    dashboard: LayoutDashboard,
    group: Users,
    verified_user: ShieldCheck,
    moped: Bike,
    event_note: Calendar,
    warning: AlertTriangle,
    bar_chart: BarChart3,
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      // Redirect to the Admin Login
      window.location.replace("/admin/login");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to log out");
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col py-6 z-50">
      {/* Header */}
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-black">
          Admin Panel
        </h1>

        <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">
          Management Console
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const IconComponent = iconMap[item.icon] || LayoutDashboard;
          const isActive = location.pathname === item.path;

          return (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`px-4 py-3 flex items-center gap-3 cursor-pointer duration-200 ease-in-out rounded-lg transition-all ${
                isActive
                  ? "bg-black text-white"
                  : "text-secondary hover:bg-surface-container"
              }`}
            >
              <IconComponent className="w-5 h-5" />

              <span className="font-label-md text-label-md">
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Logout Action at the very bottom */}
      <div className="px-3 pt-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 flex items-center gap-3 cursor-pointer duration-200 ease-in-out rounded-lg transition-all text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-label-md text-label-md">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;