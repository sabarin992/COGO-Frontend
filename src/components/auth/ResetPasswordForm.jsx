import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const validatePassword = (value) => {
    let error = "";
    if (!value) error = "Password is required";
    else if (value.length < 8) error = "Minimum 8 characters required";
    else if (!/[A-Z]/.test(value)) error = "Must contain one uppercase letter";
    else if (!/[a-z]/.test(value)) error = "Must contain one lowercase letter";
    else if (!/\d/.test(value)) error = "Must contain one number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) error = "Must contain one special character";
    return error;
  };

  const validateConfirmPassword = (value, pwd) => {
    let error = "";
    if (!value) error = "Confirm Password is required";
    else if (value !== pwd) error = "Passwords do not match";
    return error;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(val),
      confirmPassword: confirmPassword ? validateConfirmPassword(confirmPassword, val) : prev.confirmPassword,
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(val, password) }));
  };

  const getPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;
    return score;
  };

  const renderPasswordStrength = () => {
    if (!password) return null;
    const strength = getPasswordStrength(password);
    const colors = ["bg-red-500", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"];
    const labels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];

    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-1">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                index < strength ? colors[strength] : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className={`text-xs ${strength < 3 ? "text-red-500" : strength < 5 ? "text-yellow-600" : "text-green-600"}`}>
          {labels[strength]}
        </p>
      </div>
    );
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);

    if (passErr || confirmErr) {
      setErrors({
        password: passErr,
        confirmPassword: confirmErr,
      });
      toast.error("Please fix the errors in the form");
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
                onChange={handlePasswordChange}
                className={`w-full border rounded-xl pl-12 pr-12 py-3 focus:outline-none transition ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
                }`}
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
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            {renderPasswordStrength()}
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
                onChange={handleConfirmPasswordChange}
                className={`w-full border rounded-xl pl-12 pr-12 py-3 focus:outline-none transition ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
                }`}
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
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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