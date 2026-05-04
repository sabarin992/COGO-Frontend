import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/otp/send-otp", { email });

      toast.success("OTP sent to your email");

      navigate("/otp-verification", {
        state: { email, purpose: "forgot-password" },
      });

    } catch (error) {
      toast.error(error?.response?.data?.detail || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-3 w-100">
        <h1 className="text-2xl">Forgot Password</h1>

        <input
          className="border p-2"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSendOtp}
          className="border p-2 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;