import React from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/Footer";

const Home = () => {
  // useNavigate hook returns a function to navigate between routes
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      toast.success(response?.data?.message);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data);
    }
  };

  const handleProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <>
      <Header />
      <main className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl">Home Page</h1>
      </main>
      <Footer />
    </>
  );
};

export default Home;
