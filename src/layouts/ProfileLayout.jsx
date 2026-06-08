import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSideBar from "../components/profile/ProfileSideBar";

const ProfileLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <ProfileHeader />

      <div className="flex-1 w-full mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <ProfileSideBar />
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileLayout