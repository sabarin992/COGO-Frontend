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

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Register Function
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!full_name || !email || !phone || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
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

      toast.success(
        response?.data?.message || "Registration successful"
      );

      navigate("/otp-verification", {
        state: { email },
      });

    } catch (error) {
      console.log(error.response);

      toast.error(
        error?.response?.data?.detail || "Something went wrong"
      );

      toast.error(
        error?.response?.data?.detail?.[0]?.msg.split(",")[0] ===
          "Value error"
          ? error?.response?.data?.detail?.[0]?.msg.split(",")[1]
          : error?.response?.data?.detail?.[0]?.msg ||
              "Something went wrong"
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
          <h1 className="text-3xl font-bold text-black mb-2">
            Create Account
          </h1>

          <p className="text-sm text-gray-500">
            Join COGO and start riding today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={full_name}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>

            <input
              type="text"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-black transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-gray-500 hover:text-black"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-black transition"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 bottom-3 text-gray-500 hover:text-black"
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </button>
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
            
            <Link
              to="/login"
              className="text-black font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUpForm;