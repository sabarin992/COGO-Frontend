import React from "react";
import { Bell, Search } from "lucide-react";

const AdminHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200 flex justify-between items-center h-16 pl-80 pr-8">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        
        {/* Search Bar */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        
        {/* Notification */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <Bell className="text-gray-600 w-5 h-5" />
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          
          {/* Text */}
          <div className="text-right">
            <p className="text-sm font-semibold text-black leading-none">
              ADMIN
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Super Admin
            </p>
          </div>

          {/* Avatar */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxuh2qL11yvxu9GkVXlLgN0M7xu5ji_vDTuz8cpbu7o2sWZoSm7bzWZf63n1CpW0wAvgvOex-CBoGMgGlGhYCKl4WLlUZmK8SqLaWEm59cP9VEcr-ACJ2ZC5B1w7lek-QEnBFdfvWLP-6nabReFFAjjnh0SFVi5FIqlAdgkj62Y8RuF9yMwLBy9CAM-Zf5Tbt5y1_c_TJmL0GXEwfuREPOnu8qz2b2C9e3m3u5C10y4FpwhoUAbqlTnThZDRtKA4GS82EG7ueZuw"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;