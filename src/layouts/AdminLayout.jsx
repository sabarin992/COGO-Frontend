import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <AdminSideBar />
      <AdminHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="ml-72 pt-20 min-h-screen bg-gray-50">
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </main>
    </>
  );
};

export default AdminLayout;
