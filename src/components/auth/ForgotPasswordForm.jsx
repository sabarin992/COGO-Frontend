import React, { useState } from "react";
import api from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/otp/send-otp", { email });

      toast.success("OTP sent to your email");

      navigate("/otp-verification", {
        state: {
          email,
          purpose: "forgot-password",
        },
      });

    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Error sending OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        
        {/* Heading */}
        <div className="text-center">
          
          <h1 className="text-3xl font-bold text-black mb-2">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 leading-6">
            Enter your email address to receive a
            One-Time Password to reset your access.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSendOtp}
          className="flex flex-col gap-4"
        >
          
          {/* Email */}
          <div className="flex flex-col gap-2">
            
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-2">
          
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-black transition inline-flex items-center gap-2"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordForm;