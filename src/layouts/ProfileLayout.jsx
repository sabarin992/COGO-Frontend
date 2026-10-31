
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronDown, ChevronUp, UserRound } from "lucide-react";

import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSideBar from "../components/profile/ProfileSideBar";

const ProfileLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <ProfileHeader />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="profile-sidebar"
          className="md:hidden w-full mb-4 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
        >
          <span className="flex items-center gap-3 font-semibold text-gray-800">
            <UserRound className="w-5 h-5" />
            Profile Menu
          </span>

          {mobileMenuOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <aside
            id="profile-sidebar"
            className={`w-full md:w-64 lg:w-72 flex-shrink-0 ${
              mobileMenuOpen ? "block" : "hidden"
            } md:block`}
          >
            <div className="rounded-xl md:rounded-none border md:border-0 border-gray-200 bg-white md:bg-transparent p-3 md:p-0">
              <ProfileSideBar
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          </aside>

          {/* Page content */}
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileLayout;
