import React from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
      <div className="flex justify-between p-5">
        <h1 className="text-3xl">Home Page</h1>
        <button className="border p-2 cursor-pointer" onClick={handleProfile}>
          profile
        </button>
        <button className="border p-2 cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Home;
