import React, { useState } from "react";
import api from "../api";
import { data, Link } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  // state variables for user registration form inputs
  const [full_name, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // state to track loading status
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    // ensure all required input fields are filled
    if (!full_name || !email || !phone || !password) {
      toast.error("All fields are required");
      return;
    }

    // ensure password and confirm password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // data to be sent to register API
    const payload = {
      full_name: full_name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    };

    setLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      toast.success(response?.data?.message || "Registration successful");
    } catch (error) {
        console.log(error.response);
        
      toast.error(error?.response?.data?.detail || "Something went wrong");
      toast.error(error?.response?.data?.detail?.[0]?.msg.split(',')[0]==='Value error'?error?.response?.data?.detail?.[0]?.msg.split(',')[1]:error?.response?.data?.detail?.[0]?.msg  || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-3 w-100">
          <h1 className="text-2xl">Sign Up</h1>
          {/* fullname */}
          <input
            className="border p-2"
            type="text"
            placeholder="full name"
            value={full_name}
            onChange={(e) => setFullname(e.target.value)}
          />
          {/* email */}
          <input
            className="border p-2"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* phone */}
          <input
            className="border p-2"
            type="text"
            placeholder="phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {/* password */}
          <input
            className="border p-2"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* confirm password */}
          <input
            className="border p-2"
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="border p-2 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading ..." : "Sign Up"}
          </button>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
