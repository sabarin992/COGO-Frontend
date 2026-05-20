import React, { useState } from "react";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUpForm = () => {
  // Form States
  const [full_name, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error States
  const [errors, setErrors] = useState({});

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validation Rules
  const validateFullName = (value) => {
    let error = "";
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!value) error = "Full Name is required";
    else if (value.length < 3) error = "Minimum 3 characters required";
    else if (value.length > 50) error = "Maximum 50 characters allowed";
    else if (!nameRegex.test(value)) error = "Only alphabets and spaces allowed";
    return error;
  };

  const validateEmail = (value) => {
    let error = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) error = "Email is required";
    else if (!emailRegex.test(value)) error = "Invalid email format";
    return error;
  };

  const validatePhone = (value) => {
    let error = "";
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!value) error = "Phone number is required";
    else if (!phoneRegex.test(value)) error = "Must include country code (+) and exactly 10 digits (e.g. +919876543210)";
    return error;
  };

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

  // Handlers
  const handleFullNameChange = (e) => {
    const val = e.target.value;
    setFullname(val);
    setErrors((prev) => ({ ...prev, full_name: validateFullName(val) }));
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.replace(/\s/g, "").toLowerCase();
    setEmail(val);
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, "");
    if (val.indexOf("+") > 0) val = val.replace(/\+/g, "");
    if (val.startsWith("+")) val = "+" + val.substring(1).replace(/\+/g, "");
    val = val.slice(0, 14);
    setPhone(val);
    setErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
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

  // Register Function
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation Check on Submit
    const nameErr = validateFullName(full_name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);

    if (nameErr || emailErr || phoneErr || passErr || confirmErr) {
      setErrors({
        full_name: nameErr,
        email: emailErr,
        phone: phoneErr,
        password: passErr,
        confirmPassword: confirmErr,
      });
      toast.error("Please fix the errors in the form");
      return;
    }

    // Payload
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

      navigate("/otp-verification", {
        state: { email },
      });
    } catch (error) {
      console.log(error.response);

      toast.error(error?.response?.data?.detail || "Something went wrong");

      toast.error(
        error?.response?.data?.detail?.[0]?.msg.split(",")[0] === "Value error"
          ? error?.response?.data?.detail?.[0]?.msg.split(",")[1]
          : error?.response?.data?.detail?.[0]?.msg || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-sm text-gray-500">Join COGO and start riding today.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={full_name}
              onChange={handleFullNameChange}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition ${
                errors.full_name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={handleEmailChange}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              placeholder="+919876543210"
              value={phone}
              onChange={handlePhoneChange}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition ${
                errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
              }`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none transition ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3 text-gray-500 hover:text-black"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            {renderPasswordStrength()}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none transition ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 bottom-3 text-gray-500 hover:text-black"
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Loading..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUpForm;