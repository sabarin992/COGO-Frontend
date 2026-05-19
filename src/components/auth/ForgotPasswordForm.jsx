import React, { useState } from "react";
import api from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    let error = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) error = "Email is required";
    else if (!emailRegex.test(value)) error = "Invalid email format";
    return error;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.replace(/\s/g, "").toLowerCase();
    setEmail(val);
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      toast.error("Please fix the errors in the form");
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
              onChange={handleEmailChange}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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