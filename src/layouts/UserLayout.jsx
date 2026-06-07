import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
