import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/user/reset-password", {
        email,
        password,
      });

      toast.success("Password reset successful");

      navigate("/login", { replace: true });

    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Reset failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <span className="text-3xl">🔐</span>
          </div>

          <h1 className="text-3xl font-bold text-black mb-2">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 leading-6">
            Please enter your new password below
            to regain access to your account.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleResetPassword}
          className="space-y-5"
        >
          
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <div className="relative">
              
              {/* Icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-black transition"
              />

              {/* Show Hide */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              
              {/* Icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✔
              </span>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-black transition"
              />

              {/* Show Hide */}
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordForm;