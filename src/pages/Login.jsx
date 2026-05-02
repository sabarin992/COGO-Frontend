import React, { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  // Login data state   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

// useNavigate hook returns a function to navigate between routes
  const navigate = useNavigate()   

  // authenticate user by calling login API and handle response
  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      toast.success("Login successful!");
      navigate('/home')
    } catch (error) {
      toast.error(error?.response?.data?.detail);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-3 w-100">
            <h1 className="text-2xl">Login</h1>
          {/* email */}
          <input
            className="border p-2"
            type="text"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {/* password */}
          <input
            className="border p-2"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="border p-2 cursor-pointer" onClick={handleLogin}>
            Login
          </button>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
