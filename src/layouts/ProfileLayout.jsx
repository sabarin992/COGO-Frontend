import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";

const ProfileLayout = () => {
  return (
    <>
      <ProfileHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default ProfileLayout;