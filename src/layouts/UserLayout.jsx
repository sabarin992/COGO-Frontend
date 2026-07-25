import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
